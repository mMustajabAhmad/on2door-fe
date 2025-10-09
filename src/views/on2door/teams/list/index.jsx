'use client'

// React Imports
import { useState, useEffect } from 'react'

// Component Imports
import Grid from '@mui/material/Grid2'

import TeamListTable from './children/TeamListTable'

// MUI Imports

const TeamList = ({
  teamData,
  page,
  perPage,
  onPageChange,
  onPerPageChange,
  searchQuery,
  setSearchQuery,
  hubFilter,
  onHubFilterChange
}) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <TeamListTable
          tableData={teamData}
          page={page}
          perPage={perPage}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          hubFilter={hubFilter}
          onHubFilterChange={onHubFilterChange}
        />
      </Grid>
    </Grid>
  )
}

export default TeamList
