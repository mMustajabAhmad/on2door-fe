'use client'

// React Imports
import { useState, useEffect } from 'react'

// Component Imports
import TeamListTable from './children/TeamListTable'

// MUI Imports
import Grid from '@mui/material/Grid2'

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
  // Transform API data
  const transformApiData = apiData => {
    if (!apiData?.teams?.data) return []

    return apiData.teams.data.map(team => {
      const teamAttributes = team.attributes || team

      return {
        id: team.id,
        name: teamAttributes.name || 'N/A',
        hub_id: teamAttributes.hub_id || null,
        hub_name: teamAttributes.hub_name || 'No Hub Assigned',
        dispatchers_count: teamAttributes.dispatchers_count || 0,
        drivers_count: teamAttributes.drivers_count || 0,
        organization_id: teamAttributes.organization_id
      }
    })
  }

  const [data, setData] = useState(transformApiData(teamData))

  useEffect(() => {
    const transformedData = transformApiData(teamData)
    setData(transformedData)
  }, [teamData])

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
