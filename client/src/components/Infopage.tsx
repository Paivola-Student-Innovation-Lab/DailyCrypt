import { InfoHeader } from "./Header";
import Tabpanel from "./Tabpanel";
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

export default function Info() {
    const translate = useTranslation().translate;
    const transNoInt = useTranslation().translateNoInterpolate;
    return (
        <div>
            <InfoHeader />
            <Grid container spacing={2}>
                <Grid md={6} xs={6} item className={styles.grid}>
                    <Card className={styles.card} >
                        <CardContent>
                            <Typography className={styles.infotext} variant="h4">
                                {translate('infopage_title1')} <InfoIcon />
                            </Typography>
                            <div className={styles.divider} />
                            <Typography className={styles.bodytext} variant="body1">
                                {translate('info_2')}
                            </Typography>
                            <Typography className={styles.bodytext} variant="body1">
                                {translate('info_3')}
                            </Typography>
                            <Typography className={styles.bodytext} variant="body1">
                                {transNoInt('info_1').split("{PSIL}")[0]}
                                <Link to="https://psil.fi" className={styles.psil}>PSIL</Link>
                                {transNoInt('info_1').split("{PSIL}")[1]}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card className={styles.card} >
                        <CardContent>
                            <Typography className={styles.infotext} variant="h4">
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
                            <Typography className={styles.infotext} variant="h4">
                                {translate('infopage_title2')} <FolderZipIcon />
                            </Typography>
                            <div className={styles.divider} />
                            <Typography className={styles.bodytext} variant="body1">
                                {translate('zip_info_1')}
                            </Typography>
                        </CardContent>
                        <CardActions className={styles.tabs}>
                            <Tabpanel />
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};