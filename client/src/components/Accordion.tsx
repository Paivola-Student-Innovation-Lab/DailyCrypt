import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ArchivingTabpanel, ExtractingTabpanel, GuideTabpanel } from './Tabpanel';
import useTranslation from "../hooks/useTranslation";
import styles from './Accordion.module.css';
import { Typography } from '@mui/material';

function AccordionUsage() {
    const translate = useTranslation();
  return (
    <div className={styles.accordion} >
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            color: "var(--encryptgreen)",
            backgroundColor: "var(--accordiongreen)",
          }}
        >
            <Typography variant='h6'>
                {translate('archiving')}
            </Typography>
        </AccordionSummary>
        <AccordionDetails className={styles.details}>
          <ArchivingTabpanel />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            color: "var(--encryptgreen)",
            backgroundColor: "var(--accordiongreen)",
          }}
        >
            <Typography variant='h6'>
                {translate('extracting')}
            </Typography>
        </AccordionSummary>
        <AccordionDetails className={styles.details} >
          <ExtractingTabpanel />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

function GuideAccordion() {
    const translate = useTranslation();
  return  (
    <div className={styles.guideaccordion} >
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            color:"var(--encryptgreen)",
            backgroundColor: "var(--accordiongreen)",
          }}
        >
          <Typography variant='h6'>
            {translate('dailycryptguide')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={styles.details}>
          <GuideTabpanel />
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export {
  AccordionUsage, GuideAccordion
}
