import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ArchivingTabpanel, ExtractingTabpanel, DailyCryptTabpanel } from './Tabpanel';
import styles from './Accordion.module.css';
import { Typography } from '@mui/material';
import { useIntl } from 'react-intl';



function DailyCryptAccordion() {
  const translate = useIntl().formatMessage;
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
          {translate({id: 'dailycryptguide'})}
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
  const translate = useIntl().formatMessage;
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
                {translate({id: 'archiving'})}
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
                {translate({id: 'extracting'})}
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
