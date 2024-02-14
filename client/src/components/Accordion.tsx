import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ArchivingTabpanel, ExtractingTabpanel, DailyCryptTabpanel } from './Tabpanel';
import useTranslation from "../hooks/useTranslation";
import styles from './Accordion.module.css';
import { Typography } from '@mui/material';

function DailyCryptAccordion() {
  const translate = useTranslation();
return  (
  <div className={styles.dailycryptaccordion} >
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
        <DailyCryptTabpanel />
      </AccordionDetails>
    </Accordion>
  </div>
)
}

function ArchiveExtractAccordion() {
    const translate = useTranslation();
  return (
    <div className={styles.archiveaccordion} >
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

export {
  ArchiveExtractAccordion, DailyCryptAccordion
}
