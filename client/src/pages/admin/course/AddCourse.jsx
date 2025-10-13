import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateCourseMutation } from '@/features/api/courseApi';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';

const AddCourse = () => {
      const [courseTitle,setCourseTitle] = useState("")
      const [category,setCategory] = useState("")

      const [createCourse,{data,isLoading,error,isSuccess}] = useCreateCourseMutation()

      const navigate = useNavigate();
      const getSelectedCategory = (value) => {
            setCategory(value)
      }
      const createCourseHandler = async () => {
            await createCourse({courseTitle,category})
      }
      useEffect(() => {
            if(isSuccess) {
                  toast.success(data?.message || "Course created!")
                  navigate("/admin/course")
            }
      },[isSuccess,error])
  return (
    <div className="flex-1 mx-10">
      <h1 className="font-bold text-xl">
        Let's Add course, add some basic details for your new course
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
            placeholder="Your Course name"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
          />
        </div>
        <div className="space-y-4 mt-3">
          <Label>Category</Label>
          <Select value={category} onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="Next JS">Next JS</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="Data Structure & algorithms">
                  Data Structure & algorithms
                </SelectItem>
                <SelectItem value="Python1">Python</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex mt-6 gap-4">
          <Button variant="outline" onClick={() => navigate("/admin/course")}>
            Back
          </Button>
          <Button disabled={isLoading} onClick={createCourseHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-2 w-2 animate-spin" />
                <p className="pr-3">Please wait</p>
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddCourse