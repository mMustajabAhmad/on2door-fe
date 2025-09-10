// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import TaskDetails from './children/TaskDetails'

const TaskOverview = ({ taskData }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <TaskDetails taskData={taskData} />
      </Grid>
    </Grid>
  )
}

export default TaskOverview
