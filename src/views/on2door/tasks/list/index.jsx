// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import TaskListTable from './children/TaskListTable'

const TaskList = ({
  taskData,
  page,
  perPage,
  onPageChange,
  onPerPageChange,
  searchQuery,
  setSearchQuery,
  state,
  onStateChange
}) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <TaskListTable
          tableData={taskData}
          page={page}
          perPage={perPage}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          state={state}
          onStateChange={onStateChange}
        />
      </Grid>
    </Grid>
  )
}

export default TaskList
