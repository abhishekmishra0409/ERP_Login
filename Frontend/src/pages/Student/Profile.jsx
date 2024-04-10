import { SmileOutlined } from '@ant-design/icons';

const Profile = () => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return date.toLocaleDateString('en-GB', options); 
  }

    let storedUserData = JSON.parse(sessionStorage.getItem('userData'));

    const items = [
        { label: 'Name', value: storedUserData.name },
        { label: 'Email', value: storedUserData.email },
        { label: 'Department', value: storedUserData.department },
        { label: 'Enrollment No.', value: storedUserData.enrollment },
        { label: 'Batch', value: storedUserData.batch },
        { label: 'Semester', value: storedUserData.sem },
        { label: 'City', value: storedUserData.city },
        { label: 'Local Address', value: storedUserData.address },
        { label: 'Date of Birth', value: formatDate(storedUserData.dob) }, 
        { label: 'Gender', value: storedUserData.gender },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <SmileOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
                <h1 style={{ margin: 0 }}>Hello, {storedUserData.name}!</h1>
            </div>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2>User Information</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    {items.map(item => (
                        <div key={item.label}>
                            <strong>{item.label}:</strong> {item.value}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Profile;
