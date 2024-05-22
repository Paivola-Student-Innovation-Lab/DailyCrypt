import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import styles from "./LinearProgressWithLabel.module.css"

interface LinearProgressWithLabelProps extends LinearProgressProps {
  value: number;
  textColor?: string;
}

export default function LinearProgressWithLabel(props: LinearProgressWithLabelProps) {
  const { value, textColor = "textSecondary" } = props;
  return (
    <Box className={styles.outerbox}>
      <Box className={styles.innerbox}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box className={styles.valuebox}>
        <Typography variant="body2" color={textColor}>{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}