    import { useEffect, useState, useRef } from 'react';
    import { useDispatch } from 'react-redux';
    import { Select, Button, message, Spin } from 'antd';
    import { UploadOutlined } from '@ant-design/icons';
    import { uploadTimeTable } from '../../features/teacher/teacherSlice'; 

    const { Option } = Select;

    function TimeTableUpload() {
        const dispatch = useDispatch();
        const [batch, setBatch] = useState(null);
        const [selectedBatch, setSelectedBatch] = useState(null);
        const [file, setFile] = useState(null);
        const [fileName, setFileName] = useState(null);
        const [loading, setLoading] = useState(false);
        const fileInputRef = useRef(null);

        useEffect(() => {
            fetchBatchData();
        }, []);

        const fetchBatchData = async () => {
            try {
                const res = sessionStorage.getItem('batches')
                const parsedBatch = JSON.parse(res);
                setBatch(parsedBatch);
            } catch (error) {
                console.error('Error fetching batches:', error);
            }
        }

        const handleBatchSelect = (value) => {
            setSelectedBatch(value);
        };

        const handleFileChange = (e) => {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setFileName(selectedFile.name); 
        };

        const handleCustomUpload = () => {
            if (file && selectedBatch) {
                setLoading(true); 

                const formData = new FormData();
                formData.append('batch', selectedBatch);
                formData.append('imgFile', file);
        
                dispatch(uploadTimeTable(formData))
                    .then(() => {
                        message.success('File uploaded successfully');
                        setFile(null); 
                        setFileName(null); 
                    })
                    .catch((error) => {
                        console.error('Error uploading file:', error);
                        message.error('Error uploading file. Please try again.');
                    })
                    .finally(() => {
                        setLoading(false); 
                    });
            } else {
                message.error('Please select a file and batch to upload');
            }
        };
        

        return (
            <div>
                <Select
                    placeholder="Select Batch"
                    style={{ width: 200, marginBottom: '1rem', marginRight: '15px' }}
                    onChange={handleBatchSelect}
                    value={selectedBatch}
                >
                    {batch && batch.map(b => (
                        <Option key={b} value={b}>
                            {b}
                        </Option>
                    ))}
                </Select>
                <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                />
                <Button
                    icon={<UploadOutlined />}
                    size="large"
                    onClick={() => fileInputRef.current.click()} 
                >
                    {loading ? <Spin /> : fileName || 'Select File'} 
                </Button>
                <Button
                    type="primary"
                    size="large"
                    onClick={handleCustomUpload}
                    style={{ marginLeft: '15px' }}
                    loading={loading}
                >
                    Upload
                </Button>
            </div>
        );
    }

    export default TimeTableUpload;
