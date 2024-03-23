

function Student() {
    const user = JSON.parse(sessionStorage.getItem("user"));
 
    
    return (
        <div>
            {user.name}
        </div>
    );
}

export default Student;
