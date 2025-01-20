import { Table, Button } from "react-bootstrap";
import { FaTimes, FaTrash, FaCheck, FaLock, FaLockOpen } from "react-icons/fa";
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
import moment from "moment";

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

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]); // Deselect all if all are selected
    } else {
      setSelectedUsers(users.map((user) => user._id)); // Select all users
    }
  };

  const handleAction = async (action) => {
    if (selectedUsers.length === 0) {
      toast.error("Please select users to proceed");
      return;
    }

    if (window.confirm(`Are you sure you want to ${action} these users?`)) {
      let actionCount = 0; // Counter for successful actions
      let errorCount = 0; // Counter for errors
      let errorMessages = []; // Array to hold error messages

      try {
        for (const userId of selectedUsers) {
          const user = users.find((user) => user._id === userId);
          if (user.isAdmin && action === "delete") {
            // Prevent deleting admin users
            errorCount++;
            errorMessages.push(
              `${user.name} is an admin and can't be deleted.`
            );
            continue; // Skip this user
          } else if (user.isAdmin && action === "block") {
            // Prevent blocking admin users
            errorCount++;
            errorMessages.push(
              `${user.name} is an admin and can't be blocked.`
            );
            continue; // Skip this user
          }

          switch (action) {
            case "delete":
              await deleteUser(userId);
              actionCount++;
              break;
            case "block":
              if (user.isBlocked === true) {
                continue; // Skip if already blocked
              }
              await blockUser(userId);
              actionCount++;
              break;
            case "unblock":
              if (user.isBlocked === false) {
                continue; // Skip if not blocked
              }
              await unblockUser(userId);
              actionCount++;
              break;
            default:
              toast.error("Unknown action");
          }
        }

        // Show error toast if there were any errors
        if (errorCount > 0) {
          const errorMessage = `${errorCount} user${
            errorCount > 1 ? "s" : ""
          } could not be ${action}ed: user${errorCount > 1 ? "s" : ""} ${
            errorCount > 1 ? "are" : "is"
          } admin${errorCount > 1 ? "s" : ""}`;
          toast.error(errorMessage);
        }

        // Show success toast if there were any successful actions
        if (actionCount > 0) {
          toast.success(
            `${actionCount} user${
              actionCount > 1 ? "s" : ""
            } ${action}ed successfully.`
          );
        } else if (errorCount === 0) {
          toast.info("No users were affected.");
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
      <h1 className="flex justify-center text-7xl text-stroke py-5 text-pink-600">
        User List
      </h1>
      {loadingDelete && <Loader />}
      {loadingBlock && <Loader />}
      {loadingUnblock && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.message || "Not admin"}</Message>
      ) : (
        <>
          <div className="flex flex-row gap-3 py-3 pl-1">
            <input
              type="checkbox"
              checked={selectedUsers.length === users.length}
              onChange={handleSelectAll}
              className="scale-125"
            />
            <Button
              className="d-flex align-items-center gap-2 text-black border-2 border-black hover:scale-105 transition-transform duration-100 ease-in-out"
              variant="danger"
              onClick={() => handleAction("delete")}
            >
              <FaTrash /> Delete
            </Button>
            <Button
              className="d-flex align-items-center gap-2 border-2 border-black hover:scale-105 transition-transform duration-100 ease-in-out"
              variant="warning"
              onClick={() => handleAction("block")}
            >
              <FaLock /> Block
            </Button>
            <Button
              className="d-flex align-items-center gap-2 border-2 border-black hover:scale-105 transition-transform duration-100 ease-in-out"
              variant="success"
              onClick={() => handleAction("unblock")}
            >
              <FaLockOpen /> Unblock
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
                <th>LAST LOGIN</th>
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
                    <a
                      href={`mailto:${user.email}`}
                      className="underline text-blue-500"
                    >
                      {user.email}
                    </a>
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
                  <td className="font-thin">
                    {moment(user.lastLogin).format("MMMM Do YYYY, h:mm:ss a")}
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
