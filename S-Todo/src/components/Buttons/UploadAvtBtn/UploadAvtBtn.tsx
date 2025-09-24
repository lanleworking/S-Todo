import { useState, type Dispatch, type SetStateAction } from 'react'
import { Upload } from 'antd'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import ImgCrop from 'antd-img-crop'
import toast from 'react-hot-toast'
import { FiUpload } from 'react-icons/fi'
import { Center } from '@mantine/core'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]
type UploadAvtBtnType = {
  setAvtFile: Dispatch<SetStateAction<File | null>>
}

const UploadAvtBtn = ({ setAvtFile }: UploadAvtBtnType) => {
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isJpgOrPng || !isLt2M) {
      toast.error('You can only upload JPG/PNG files smaller than 2MB!')
      return Upload.LIST_IGNORE // prevent adding to fileList
    }

    return true
  }

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList)

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType)
    }
  }

  const customRequest: UploadProps['customRequest'] = async ({
    file,
    onSuccess,
  }) => {
    setAvtFile(file as File)
    // simulate "success" without fetching
    setTimeout(() => {
      onSuccess?.('ok')
    }, 0)
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <Center>
        <FiUpload />
      </Center>
      {/* {loading ? <LoadingOutlined /> : <PlusOutlined />} */}
      <div style={{ marginTop: 8 }}>Avatar</div>
    </button>
  )

  return (
    <ImgCrop rotationSlider>
      <Upload
        type="select"
        name="avatar"
        listType="picture-circle"
        fileList={fileList}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onPreview={handlePreview}
        customRequest={customRequest}
        // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
    </ImgCrop>
  )
}

export default UploadAvtBtn
