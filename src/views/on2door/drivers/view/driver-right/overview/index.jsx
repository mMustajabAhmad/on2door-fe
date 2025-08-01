
'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ProjectListTable from './ProjectListTable'
import UserActivityTimeLine from './DriverActivityTimeline'
import InvoiceListTable from './InvoiceListTable'

// Data Imports
import { getInvoiceData } from '@/app/server/actions'

const OverViewTab = ({ userData }) => {
  // States
  const [invoiceData, setInvoiceData] = useState([])

  // Effects
  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const data = await getInvoiceData()
        console.log('Invoice data fetched:', data)
        setInvoiceData(data)
      } catch (error) {
        console.error('Error fetching invoice data:', error)
      }
    }

    fetchInvoiceData()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ProjectListTable userData={userData} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <UserActivityTimeLine userData={userData} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <InvoiceListTable invoiceData={invoiceData} />
      </Grid>
    </Grid>
  )
}

export default OverViewTab
