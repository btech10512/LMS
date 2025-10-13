import { Card, CardContent } from '@/components/ui/card'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import React from 'react'
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';


const Course = ({course}) => {
  return (
    <Link to={`course-detail/${course._id}`}>
      <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transfrom hover:scale-105 transition-all duration-300 p-0">
        <div className="relative">
          <img
            className="w-full h-36 object-cover rounded-t-lg"
            src={course.courseThumbnail}
            alt="course"
          />
        </div>
        <CardContent className="mt-2">
          <h1 className="hover:underline font-bold text-lg truncate ">
            {course.courseTitle}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 m-2">
                <AvatarImage
                  src={
                    course.creator?.photoUrl || "https://github.com/shadcn.png"
                  }
                  alt="@shadcn"
                />
                <AvatarFallback className="h-8 w-8 text-xs">CN</AvatarFallback>
              </Avatar>
              <h1 className="font-medium text-sm">{course.creator?.name}</h1>
            </div>
            <Badge className="bg-blue-600 text-white px-2 py-1 text-xs rounded-full">
              {course.courseLevel}
            </Badge>
          </div>
          <div className="text-lg font-bold mb-3 mt-2">
            <span>₹{course.coursePrice}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default Course