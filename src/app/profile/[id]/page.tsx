export default function UserProfile({ params }: any) {
    const id = params.id;
    return (
        <div>
            <h1>Profile</h1>
            <hr />
            <p>User Profile {id}</p>
        </div>
    );
}
