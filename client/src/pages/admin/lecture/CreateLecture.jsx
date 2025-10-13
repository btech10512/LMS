import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Lecture from './Lecture';




const CreateLecture = () => {
      const params = useParams()
      const courseId = params.courseId
      const [lectureTitle,setLectureTitle] = useState("")
      const navigate = useNavigate()

      const [createLecture,{data,isLoading,error,isSuccess}] = useCreateLectureMutation()

      const {data: lectureData,isLoading:lectureLoading,isError:lectureError,refetch} = useGetCourseLectureQuery(courseId)

      const createLectureHandler = async () => {
            await createLecture({lectureTitle,courseId})
      }
      useEffect(() => {
        if (isSuccess) {
            refetch()
          toast.success(data?.message || "Lecture created successfully");
        }
        if (error) {
          toast.error(error?.data?.message || "Something went wrong");
        }
      }, [isSuccess, error, data]);


      console.log(lectureData);
      
  return (
    <div className="flex-1 mx-10">
      <h1 className="font-bold text-xl">
        Let's Add lectures, add some basic details for your new lecture
      </h1>
      <p className="test-sm">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum, nemo.
      </p>
      <div>
        <div className="space-y-4">
          <Label>Title</Label>
          <Input
            type="text"
            // name="courseTitle"
            placeholder="Your Course Title"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
          />
        </div>
        <div className="flex mt-6 gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
          >
            Back to course
          </Button>
          <Button disabled={isLoading} onClick={createLectureHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-2 w-2 animate-spin" />
                <p className="pr-3">Please wait</p>
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>
        <div className="mt-10">
          {lectureLoading ? (
            <p>Loading Lecture...</p>
          ) : lectureError ? (
            <p>Failed to load lectures</p>
          ) : lectureData.lectures.length === 0 ? (
            <p>No lectures avilable</p>
          ) : (
            lectureData.lectures.map((lecture,index) => (

                  <Lecture key={lecture._id} lecture={lecture} index={index} courseId={courseId} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateLecture