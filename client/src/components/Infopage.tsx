import { Header2 } from "./Header";
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
import { ArchiveExtractAccordion, DailyCryptAccordion } from "./Accordion";
import { FormattedMessage } from "react-intl";

export default function Info(props: any) {
    return (
        <div>
            <Header2 setLanguage={props.setLanguage} />
            <div className={styles.page}>
                <Grid md={6} xs={6} item className={styles.grid}>
                    <Card className={styles.card} >
                        <CardContent>
                            <Typography className={styles.infotitle} variant="h4">
                                <FormattedMessage id="infopage_title1" />  <InfoIcon />
                            </Typography>
                            <div className={styles.divider} />
                            <Typography className={styles.bodytext} variant="body1">
                                <FormattedMessage id="info_2" />
                            </Typography>
                            <Typography className={styles.bodytext} variant="body1">
                                <FormattedMessage id="info_3" />
                            </Typography>
                            <DailyCryptAccordion />
                            <Typography className={styles.psiltitle} variant="body1">
                                <FormattedMessage id="info_1" 
                                    values={{ PSIL: "PSIL" }}
                                /> 
                            </Typography>
                            <Link to="https://psil.fi"><img src='./images/psil.svg' className={styles.psil} alt=''/></Link>
                        </CardContent>
                    </Card>
                    <Card className={styles.card} >
                        <CardContent>
                            <Typography className={styles.infotitle} variant="h4">
                                <FormattedMessage id='infopage_title3' /> <TabIcon />
                            </Typography>
                            <div className={styles.divider} />
                            <Typography className={styles.bodytext} variant="body1" >
                                <FormattedMessage id='browser_info1' />
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={6} md={6} item className={styles.grid}>
                    <Card className={styles.guide} >
                        <CardContent>
                            <Typography className={styles.infotitle} variant="h4">
                                <FormattedMessage id="infopage_title2" /> <FolderZipIcon />
                            </Typography>
                            <div className={styles.divider} />
                            <Typography className={styles.bodytext} variant="body1">
                                <FormattedMessage id="zip_info_1" />
                            </Typography>
                        </CardContent>
                        <CardActions className={styles.tabs}>
                            <ArchiveExtractAccordion />
                        </CardActions>
                    </Card>
                </Grid>
            </div>
        </div>
    );
};