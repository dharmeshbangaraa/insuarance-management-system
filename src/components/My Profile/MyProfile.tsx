import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./MyProfile.css"; // Import the CSS files

type UserDetails = {
    id: number;
    name: string;
    email: string;
  };

  type Policy = {
    id: string;
    policyName: string;
    category: string;
    company: string;
    cover: string;
    totalPremium: number;
    duration: number;
    claimPercent: number;
    appliedUser: number[];
  };


  const loadUserDetails = (): UserDetails | null => {
    const storedUser = sessionStorage.getItem("userData");
    if (storedUser) {
      const parsedData = JSON.parse(storedUser);
      console.log(parsedData);
      return {id: parsedData.id, name: parsedData.firstName, email: parsedData.email};
    }
    return null;
  };

    const PolicyList: React.FC<{userId: UserDetails | null}> = ({userId}) => {
      const [policies, setPolicies] = useState<Policy[]>([]);
      const [loading, setLoading] = useState<boolean>(true);

      useEffect(() => {
        // Fetch data from the Spring Boot API
        if(userId && userId.id) {
            const fetchPoliciesbyId = async (userId: number | undefined) => {
                try {
                  const response = await fetch(`http://localhost:8080/api/v1/policy/user?userId=${userId}`); // Replace with your API endpoint
                  if (!response.ok) {
                    throw new Error('Failed to fetch policies');
                  }
                  const data = await response.json();
                  setPolicies(data);
                } catch (error) {
                  console.error('Error fetching policies:', error);
                } finally {
                  setLoading(false);
                }
              };
              fetchPoliciesbyId(userId.id);
        }else {
            setLoading(false); // If no userId, stop loading
        }
      }, [userId]);
    
      if (loading) {
        return <p className="text-center text-gray-500">Loading policies...</p>;
      }
    
      if (policies.length === 0) {
        return <p className="text-center text-gray-500">No policies available.</p>;
      }
    
      return (
        <div>
          {policies.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      );
    };

    const PolicyCard: React.FC<{ policy: Policy }> = ({ policy }) => (
        <div className="policy-card border rounded shadow p-4">
          <div className="items-center">
            <h2 className="text-lg font-bold">{policy.policyName}</h2>
          </div>
          <p className="text-gray-600">{policy.company}</p>
          <p>Cover: {policy.cover}</p>
          <p>{policy.category}</p>
          <p>Claim Settled: <b>{policy.claimPercent}%</b></p>
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            ${policy.totalPremium}/month
          </button>
          <button className="claim-btn">Claim
</button>
        </div>
      );

const MyProfile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetails | null>(null);

  const [selectedOption, setSelectedOption] = useState<string>("");

  const options = ["My Policies","Edit Name", "Change Password", "Update Contact Info"];

  // Function to load user details from session storage
  useEffect(() => {
    // Load user details only once when the component mounts
    const userDetails = loadUserDetails();
    setUser(userDetails);
  }, []); // Empty dependency array ensures this runs only once

  const renderDetails = () => {
    switch (selectedOption) {
      case "Edit Name":
        return (
          <div>
            <h3 className="section-title">Edit Name</h3>
            <form>
              <label className="form-label">
                First Name:
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your first name"
                />
              </label>
              <label className="form-label">
                Last Name:
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your last name"
                />
              </label>
              <button type="submit" className="form-button">
                Save
              </button>
            </form>
          </div>
        );
      case "Change Password":
        return (
          <div>
            <h3 className="section-title">Change Password</h3>
            <form>
              <label className="form-label">
                Current Password:
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter current password"
                />
              </label>
              <label className="form-label">
                New Password:
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter new password"
                />
              </label>
              <label className="form-label">
                Confirm New Password:
                <input
                  type="password"
                  className="form-input"
                  placeholder="Confirm new password"
                />
              </label>
              <button type="submit" className="form-button">
                Save
              </button>
            </form>
          </div>
        );
      case "Update Contact Info":
        return (
          <div>
            <h3 className="section-title">Update Contact Info</h3>
            <form>
              <label className="form-label">
                Email:
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                />
              </label>
              <label className="form-label">
                Phone Number:
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Enter your phone number"
                />
              </label>
              <button type="submit" className="form-button">
                Save
              </button>
            </form>
          </div>
        );
      default:
        return (
            <div>
                <PolicyList userId={user} />
            </div>
        );
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
    sessionStorage.clear();
    navigate("/");
  }

  const handleHome = () => {
    console.log("homepage...");
    navigate("/home");
  }

  return (
    <div>
      <header className="bg-white shadow p-4 text-2xl font-bold">
        <div>
          ABC Insurance
        </div>
        <div className="links">
          <div className="link" onClick={handleHome}>
            Home
          </div>
          <div className="link" onClick={handleLogout}>
            Logout
          </div>
        </div>
      </header>
    <div className="profile-container">
      <div className="profile-sidebar">
        <h2 className="sidebar-title">Welcome {user?.name}!</h2>
        <ul className="options-list">
          {options.map((option) => (
            <li
              key={option}
              className={`option-item ${
                selectedOption === option ? "active-option" : ""
              }`}
              onClick={() => setSelectedOption(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
      <div className="profile-details">{renderDetails()}</div>
    </div>
    </div>
  );
};

export default MyProfile;
