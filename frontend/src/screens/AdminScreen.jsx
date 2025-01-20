import { Table, Button } from "react-bootstrap";
import { FaTimes, FaTrash, FaCheck, FaCross } from "react-icons/fa";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
} from "../redux/slices/usersApiSlice";
import { toast } from "react-toastify";
import { useState } from "react";

const AdminScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();
  const [blockUser, { isLoading: loadingBlock }] = useBlockUserMutation();
  const [unblockUser, { isLoading: loadingUnblock }] = useUnblockUserMutation();

  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleAction = async (action) => {
    if (selectedUsers.length === 0) {
      toast.error("Please select users to proceed");
      return;
    }

    if (window.confirm(`Are you sure you want to ${action} these users?`)) {
      try {
        for (const userId of selectedUsers) {
          if (action === "delete") {
            await deleteUser(userId);
            toast.success("User deleted");
          } else if (action === "block") {
            await blockUser(userId);
            toast.success("User blocked");
          } else if (action === "unblock") {
            await unblockUser(userId);
            toast.success("User unblocked");
          }
        }
        setSelectedUsers([]); // Reset selection after action
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <h1>User List</h1>
      {loadingDelete && <Loader />}
      {loadingBlock && <Loader />}
      {loadingUnblock && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.message || "Not admin"}</Message>
      ) : (
        <>
          <div className="mb-3">
            <Button
              variant="danger"
              className="btn-sm"
              onClick={() => handleAction("delete")}
            >
              <FaTrash /> Delete Selected Users
            </Button>
            <Button
              variant="danger"
              className="btn-sm"
              onClick={() => handleAction("block")}
            >
              <FaCross /> Block Selected Users
            </Button>
            <Button
              variant="success"
              className="btn-sm"
              onClick={() => handleAction("unblock")}
            >
              <FaCross /> Unblock Selected Users
            </Button>
          </div>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Select</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th>BLOCKED</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {user.isBlocked ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default AdminScreen;
