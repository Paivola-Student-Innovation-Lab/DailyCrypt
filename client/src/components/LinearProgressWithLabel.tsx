import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import styles from "./LinearProgressWithLabel.module.css"


export default function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box className={styles.outerbox}>
      <Box className={styles.innerbox}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box className={styles.valuebox}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}