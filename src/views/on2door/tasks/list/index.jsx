// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import TaskListTable from './children/TaskListTable'

const TaskList = ({ userData }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <TaskListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default TaskList
