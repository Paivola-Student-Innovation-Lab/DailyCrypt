import { InfoHeader } from "./Header";
import styles from "./Infopage.module.css";
import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import CardActions from "@mui/material/CardActions";
import InfoIcon from '@mui/icons-material/Info';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import TabIcon from '@mui/icons-material/Tab';
import { Link } from 'react-router-dom';
import useTranslation from "../hooks/useTranslation";
import { ArchiveExtractAccordion, DailyCryptAccordion } from "./Accordion";

export default function Info() {
    const translate = useTranslation();
    const psilString = translate('info_1', '{"PSIL": "<Link to=`https://psil.fi`> </Link>"}')
    const psilObject = {__html: psilString}
    const psilComponent = () => {
        return <div dangerouslySetInnerHTML={psilObject}/>
    }
    return (
        <div>
            <InfoHeader />
            <Grid container spacing={2}>
                <Grid md={6} xs={6} item className={styles.grid}>
                    <Card className={styles.card} >
                        <CardContent>
                            <Typography className={styles.infotitle} variant="h4">
                                {translate('infopage_title1')} <InfoIcon />
                            </Typography>
                            <div className={styles.divider} />
                            <Typography className={styles.bodytext} variant="body1">
                                {translate('info_2')}
                            </Typography>
                            <Typography className={styles.bodytext} variant="body1">
                                {translate('info_3')}
                            </Typography>
                            <DailyCryptAccordion />
                            <Typography className={styles.psiltitle} variant="h6">
                                {psilComponent()} <Link to="https://psil.fi"><img src='./images/psil.svg' className={styles.psil} alt=''/></Link>
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card className={styles.card} >
                        <CardContent>
                            <Typography className={styles.infotitle} variant="h4">
                                {translate('infopage_title3')} <TabIcon />
                            </Typography>
                            <div className={styles.divider} />
                            <Typography className={styles.bodytext} variant="body1" >
                                {translate('browser_info1')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={6} md={6} item>
                    <Card className={styles.guide} >
                        <CardContent>
                            <Typography className={styles.infotitle} variant="h4">
                                {translate('infopage_title2')} <FolderZipIcon />
                            </Typography>
                            <div className={styles.divider} />
                            <Typography className={styles.bodytext} variant="body1">
                                {translate('zip_info_1')}
                            </Typography>
                        </CardContent>
                        <CardActions className={styles.tabs}>
                            <ArchiveExtractAccordion />
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};