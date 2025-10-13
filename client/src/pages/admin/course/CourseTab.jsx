import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/RichTextEditor.jsx';
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from '@/features/api/courseApi';
import { toast } from 'sonner';

const CourseTab = () => {
      
      const navigate = useNavigate()
      const params = useParams();
      const courseId = params.courseId;
      const [input,setInput] = useState({
            courseTitle:"",
            subtitle:"",
            description:"",
            category:"",
            courseLevel:"",
            coursePrice:"",
            courseThumbnail:""
      })
      const { data:courseByIdData, isLoading:courseByIdLoading ,refetch} = useGetCourseByIdQuery(courseId,{refetchOnMountOrArgChange:true});
      
      const [publishCourse,{}] = usePublishCourseMutation()
      
      useEffect(() => {
        if (courseByIdData?.course) {
          const course = courseByIdData?.course;
          setInput({
            courseTitle: course.courseTitle,
            subtitle: course.subtitle,
            description: course.description,
            category: course.category,
            courseLevel: course.courseLevel,
            coursePrice: course.coursePrice,
            courseThumbnail: "",
          });
        }
      }, [courseByIdData]);
      // if(courseByIdLoading) return <h1>Loading...</h1>
      
      // <Card>
      //   <CardContent>
      //     {courseByIdLoading ? (
      //       <div className="flex justify-center items-center h-40">
      //         <Loader2 className="h-6 w-6 animate-spin" />
      //       </div>
      //     ) : (
      //       <div>{/* full form JSX here */}</div>
      //     )}
      //   </CardContent>
      // </Card>;

      
      const [previewThumbnail,setPreviewThumbnail] = useState("") 
      const [editCourse,{data,isLoading,isSuccess,error}] = useEditCourseMutation()
      const changeEventHandler = (e) => {
            const {name,value} = e.target
            setInput({...input,[name]:value})
      }

      const selectCategory = (value) => {
            setInput({...input,category:value})
      }
      const selectCourseLevel = (value) => {
            setInput({...input,courseLevel:value})
      }

      const selectThumbnail = (e) => {
            const file = e.target.files?.[0]
            if(file){
                  setInput({...input,courseThumbnail:file})
                  const fileReader = new FileReader()
                  fileReader.onloadend = () => setPreviewThumbnail(fileReader.result)
                  fileReader.readAsDataURL(file) 
            }
      }
      const updateCourseHandler = async () => {
            const formData = new FormData()
            formData.append("courseTitle",input.courseTitle)
            formData.append("subtitle",input.subtitle)
            formData.append("description",input.description)
            formData.append("category", input.category);
            formData.append("courseLevel", input.courseLevel);
            formData.append("coursePrice", input.coursePrice);
            formData.append("courseThumbnail", input.courseThumbnail);
            await editCourse({formData,courseId})
            
      }
      const publishStatusHandler = async (action) => {
            try {
                  const response = await publishCourse({courseId,query:action})
                  if(response.data) {
                        refetch()
                        toast.success(response.data.message)
                  }
            } catch (error) {
                  toast.error("Failed to publish/unpublish course")
            }
      }
      useEffect(() => {
            if(isSuccess) {
                  toast.success(data.message || "Course updated")
            }
            if(error) {
                  toast.error(error.data.message || "Failed to update course")
            }
      },[isSuccess,error])
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to your Courses here. Click save when you're done
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button disabled={courseByIdData?.course.lectures.length === 0} variant="outline" onClick={() => publishStatusHandler(courseByIdData?.course.isPublished ? "false" : "true")}>
            {courseByIdData?.course.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button>Remove Course</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Course Title</Label>
            <Input
              type="text"
              placeholder="Ex. FullStack developer"
              name="courseTitle"
              className="mt-3"
              value={input.courseTitle}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Course Subtitle</Label>
            <Input
              type="text"
              placeholder="Ex. Become a fullstack developer from zero to hero in two months"
              name="subtitle"
              className="mt-3"
              value={input.subtitle}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Course Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="flex items-center gap-5">
            <div>
              <Label className="mb-3">Category</Label>
              <Select onValueChange={selectCategory}>
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
            <div>
              <Label className="mb-3">Course Level</Label>
              <Select onValueChange={selectCourseLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermidiate">Intermidiate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-3">Price (in INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="199"
                className="w-fit"
              />
            </div>
          </div>
          <div>
            <Label className="mb-3">Course Thumbnail</Label>
            <Input
              type="file"
              accept="image/*"
              className="w-fit"
              onChange={selectThumbnail}
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="w-64 my-2"
                alt="Course-Thumbnail"
              />
            )}
          </div>
          <div>
            <Button variant="outline" onClick={() => navigate("/admin/course")}>
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={updateCourseHandler}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseTab