
'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ProjectListTable from './ProjectListTable'
import UserActivityTimeLine from './OrganizationActivityTimeline'
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
        // Fallback to mock data if server action fails
        const mockData = [
          {
            id: '4987',
            issuedDate: '13 Dec 2024',
            address: '7777 Mendez Plains',
            company: 'Hall-Robbins PLC',
            companyEmail: 'don85@johnson.com',
            country: 'USA',
            contact: '(616) 865-4180',
            name: 'Jordan Stevenson',
            service: 'Software Development',
            total: 3428,
            avatar: '',
            avatarColor: 'primary',
            invoiceStatus: 'Paid',
            balance: '$724',
            dueDate: '23 Dec 2024'
          },
          {
            id: '4988',
            issuedDate: '17 Dec 2024',
            address: '04033 Wesley Wall Apt. 961',
            company: 'Mccann LLC and Sons',
            companyEmail: 'brenda49@taylor.info',
            country: 'Haiti',
            contact: '(226) 204-8287',
            name: 'Stephanie Burns',
            service: 'UI/UX Design & Development',
            total: 5219,
            avatar: '/images/avatars/1.png',
            invoiceStatus: 'Downloaded',
            balance: 0,
            dueDate: '15 Dec 2024'
          }
        ]
        setInvoiceData(mockData)
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
