import { Descriptions } from 'antd';

function Student() {
    // const dispatch = useDispatch(); 

    let storedUserData = JSON.parse(sessionStorage.getItem('userData'));

    // console.log(user);
    

    const items = [
        {
          key: '1',
          label: 'Name',
          children: `${storedUserData.name}`,
        },
        {
          key: '2',
          label: 'Email',
          children: `${storedUserData.email}`,
        },
        {
          key: '3',
          label: 'Department',
          children:` ${storedUserData.department}`,
        },
        {
          key: '4',
          label: 'Enrollment No.',
          children:` ${storedUserData.enrollment}`,
        },
        {
          key: '5',
          label: 'Batch',
          children:` ${storedUserData.batch}`,
        },
        {
          key: '6',
          label: 'Semester',
          children:` ${storedUserData.sem}`,
        },
        {
          key: '7',
          label: 'City',
          children:` ${storedUserData.city}`,
        },
        {
          key: '8',
          label: 'Local Address',
          children:` ${storedUserData.address}`,
        },
        {
          key: '9',
          label: 'dob',
          children:` ${storedUserData.dob}`,
        },
        {
          key: '10',
          label: 'Gender',
          children:` ${storedUserData.gender}`,
        },
    
      ];
    const dashboard = `Hello! ${storedUserData.name} `;
    return (
    <>
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
        <Descriptions title={dashboard} items={items}  />
    </fieldset>

    </>
    );
}

export default Student;
