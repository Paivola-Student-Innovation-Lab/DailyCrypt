import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ArchivingTabpanel, ExtractingTabpanel } from './Tabpanel';
import useTranslation from "../hooks/useTranslation";
import styles from './Accordion.module.css';
import { Typography } from '@mui/material';

export default function AccordionUsage() {
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
        <AccordionDetails>
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
        <AccordionDetails>
          <ExtractingTabpanel />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
