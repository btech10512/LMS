import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useGetPurchasedCoursesQuery } from '@/features/api/purchaseApi'
import { LineChart } from 'lucide-react'
import React from 'react'
import { CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const Dashboard = () => {
  const {data,isSuccess,isError,isLoading} = useGetPurchasedCoursesQuery()
  if(isLoading) return <h1>Loading...</h1>
  if(isError) return <h1 className='text-red-500'>Failed to get purchased course</h1>

  const {purchasedCourse} = data || []

  const courseData = purchasedCourse.map((course) => ({
    name:course.courseId.courseTitle,
    price:course.courseId.coursePrice
  }))
  const totalRevenue = purchasedCourse.reduce((acc,element) => acc+(element.amount || 0),0)
  const totalSales = purchasedCourse.length
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
        </CardContent>
      </Card>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">{totalRevenue}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Course Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer>
            <LineChart>
              <CartesianGrid />
              <XAxis />
              <YAxis />
              {/* <Tooltip></Tooltip> */}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard