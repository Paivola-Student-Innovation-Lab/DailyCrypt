import { useDropzone, DropzoneOptions } from "react-dropzone";

import { FileUploadRounded } from "@mui/icons-material";
import { Typography } from "@mui/material";

import styles from "./Dropzone.module.css";

import { FormattedMessage } from "react-intl";

interface Props {
  updateFiles: (files: File[]) => void;
  isFiles: File;
  isDirectoryInput: boolean;
}

const Dropzone = (props: Props) => {
  const formatFileSize = (sizeInBytes: number) => {
    const kilobytes = sizeInBytes / 1000; // Convert to kilobytes
    const megabytes = kilobytes / 1000; // Convert to megabytes
    const gigabytes = megabytes / 1000; // Convert to gigabytes

    switch (true) {
      case gigabytes >= 1:
        return `${gigabytes.toFixed(2)} GB`;
      case megabytes >= 1:
        return `${megabytes.toFixed(2)} MB`;
      case kilobytes >= 1:
        return `${kilobytes.toFixed(2)} KB`;
      default:
        return `${sizeInBytes} bytes`;
    }
  };
  

  const handleDrop = (acceptedFiles: File[]) => {
    props.updateFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    multiple: true,
    useFsAccessApi: false,
  } as DropzoneOptions);

  return (
    <div {...getRootProps({type:"file", directory:"true", webkitdirectory:"true"})} className={styles.dropzone}>
      <input {...getInputProps(props.isDirectoryInput?{type:"file", directory: "true", webkitdirectory: "true"} : {})} />
      {props.isFiles ? (
        <Typography color="text.secondary">
          <FormattedMessage 
            id="dropbox_text3" 
            values={
              {
              file_name: <b style={{ color: "var(--encryptgreen)" }}>{props.isFiles.name}</b>,
              file_size: formatFileSize(props.isFiles.size)
              }
            }
          />
          <br></br>
          <FormattedMessage id="dropbox_text2" values={{directory: props.isDirectoryInput}}/>
        </Typography>
      ) : (
        <>
          <Typography color="text.secondary">
          <FormattedMessage id="dropbox_text1" values={{directory: props.isDirectoryInput}}/>
          </Typography>
          <FileUploadRounded />
        </>
      )}
    </div>
  );
};

export default Dropzone;
