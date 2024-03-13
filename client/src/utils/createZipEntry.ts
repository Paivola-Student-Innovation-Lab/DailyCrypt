import { chunkFile } from "../hooks/useChunking";


//original source https://gist.github.com/rvaiya/4a2192df729056880a027789ae3cd4b7

async function createZipEntries(files: File[]) {
    // Generate the crc32 table instead of hardcoding it to avoid having a giant constant
    // in the minified output...
    const crc32_table = function() {
        const tbl = [];
        let c;
        for(let n = 0; n < 256; n++){
                c = n;
        for(let k =0; k < 8; k++){
                c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }

        tbl[n] = c;
        }

            return tbl;
    }();
    //generate the crc checksum of the file
    async function crc32(file: File) {
        let crc = -1;
        const chunkSize = 4000000;
        const totalChunks = Math.ceil(file.size / chunkSize);
        for(let amount = 0; amount<totalChunks; amount++){
                const arr = await chunkFile(amount*chunkSize, chunkSize, file)
                for(let i=0; i<arr.length; i++) {
                        crc = (crc >>> 8) ^ crc32_table[(crc ^ arr[i]) & 0xFF];
                }
        }
        return (crc ^ (-1)) >>> 0;
    }

    //add values to the array(file header) as sertain byte length

    function putUint32s(arr: Uint8Array, offset: number, ...values: number[]) {
        const dv = new DataView(arr.buffer);
        values.forEach((v,i)=>dv.setUint32(offset+i*4, v, true));
    }
    
    function putUint16s(arr: Uint8Array, offset:number, ...values: number[]) {
        const dv = new DataView(arr.buffer);
        values.forEach((v,i)=>dv.setUint16(offset+i*2, v, true));
    }


    const extractableFiles: any[] = []
    const centralDirectoryFileHeaders: Uint8Array[] = []
    const te = new TextEncoder();

    let offset = 0;
    let cdSz = 0;
    for(const file of files){
        const fh = new Uint8Array(30+file.name.length);
        const fname = te.encode((file.webkitRelativePath!=="")? file.webkitRelativePath : file.name);
        const chksum = await crc32(file);

        //create a local file header for the file
        putUint32s(fh, 0, 0x04034b50);
        putUint32s(fh, 14, chksum, file.size, file.size);
        putUint16s(fh, 26, file.name.length);

        fh.set(fname, 30);

        extractableFiles.push(fh);
        extractableFiles.push(file);
        //Create CD records pending flush at the end...
        const fileCdr = new Uint8Array(46+file.name.length);

        //create a central directory file header for the file
        putUint32s(fileCdr, 0, 0x02014b50);
        putUint32s(fileCdr, 16, chksum, file.size, file.size);
        putUint16s(fileCdr, 28, file.name.length);
        putUint32s(fileCdr, 42, offset);

        fileCdr.set(fname, 46);

        cdSz += fileCdr.length;
        offset += fh.length + file.size;
        centralDirectoryFileHeaders.push(fileCdr)
    };

    //add all central directory filr headers to the array, wich will be combined into a zip file.
    centralDirectoryFileHeaders.forEach(header => {extractableFiles.push(header)})
    //create the end of central directory
    const eocd = new Uint8Array(22);

    putUint32s(eocd, 0, 0x06054b50);
    putUint16s(eocd, 8, files.length, files.length);
    putUint32s(eocd, 12, cdSz, offset);
    
    extractableFiles.push(eocd)
    return extractableFiles
}
export default createZipEntries