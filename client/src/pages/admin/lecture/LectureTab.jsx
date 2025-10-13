import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/api/courseApi'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const MEDIA_API = "http://localhost:8080/api/v1/media"

const LectureTab = () => {
      const [lectureTitle,setLectureTitle] = useState("")
      const [uploadVideoInfo,setUploadVideoInfo] = useState(null)
      const [isFree,setIsFree] = useState(false)
      const [mediaProgress,setMediaProgress] = useState(false)
      const [uploadProgress,setUploadProgress] = useState(0)
      const [btnDisable,setBtnDisable] = useState(true)
      const [editLecture, {data,isLoading,error,isSuccess}] = useEditLectureMutation()

      const params = useParams()
      const {courseId,lectureId} = params

      const {data:lectureData} = useGetLectureByIdQuery(lectureId)
      const lecture = lectureData?.lecture

      useEffect(() => {
            if(lecture) {
                  setLectureTitle(lecture.lectureTitle)
                  setIsFree(lecture.isPreviewFree)
                  setUploadVideoInfo(lecture.videoInfo)
            }
      },[lecture])

      const [removeLecture,{data:removeData,isLoading:removeLoading,isSuccess:removeSuccess}] = useRemoveLectureMutation()
      const fileChangeHandler = async (e) => {
            const file = e.target.files[0]
            if(file) {
                  const formData = new FormData()
                  formData.append("file",file)
                  setMediaProgress(true)
                  try {
                        const res = await axios.post(`${MEDIA_API}/upload-video`,formData,{
                              onUploadProgress:({loaded,total}) => {
                                    setUploadProgress(Math.round((loaded*100)/total))
                              }
                        })
                        if(res.data.success) {
                              setUploadVideoInfo({videoUrl:res.data.data.url,publicId:res.data.data.publicId})
                              setBtnDisable(false)
                              toast.success(res.data.message)
                        }
                  } catch (error) {
                        console.log(error);
                        toast.error("Video upload failed")
                        
                  } finally{
                        setMediaProgress(false)
                  }
            }
      }
      const editLectureHandler = async (e) => {
            await editLecture({lectureTitle,videoInfo:uploadVideoInfo,courseId,lectureId,isPreviewFree:isFree})
      }
      useEffect(() => {
            if(isSuccess) {
                  toast.success(data.message)
            }
            if(error) {
                  toast.error(error.data.message)
            }
      },[isSuccess,error])
      const navigate = useNavigate()
      const removeLectureHandler = async () => {
            await removeLecture({lectureId})
            navigate(-1)
      }
      useEffect(() => {
            if(removeSuccess) {
                  toast.success(removeData.message)
            }
      },[removeSuccess])

  return (
    <Card>
      <CardHeader className="flex flex-col justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make changes and click save when done
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            disabled={removeLoading}
            onClick={removeLectureHandler}
            variant="destructive"
          >
            {removeLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              "Remove Lecture"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Title</Label>
          <Input
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            type="text"
            placeholder="Ex.Introduction to JS"
          />
        </div>
        <div className="mt-5">
          <Label>
            Video <span className="text-red-500">*</span>{" "}
          </Label>
          <Input
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
            placeholder="Ex.Introduction to JS"
            className="w-fit"
          />
        </div>
        <div className="flex items-center space-x-2 my-5">
          <Switch checked={isFree} onCheckedChange={setIsFree} id="airplane-mode" />
          <Label htmlFor="airplane-mode">Is this lecture FREE</Label>
        </div>
        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}
        <div className="mt-4">
          <Button disabled={isLoading} onClick={editLectureHandler}>
            {
                  isLoading ? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                  </>
                  ) : (
                  "Update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default LectureTab