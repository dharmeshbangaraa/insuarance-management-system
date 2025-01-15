import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css'

type UserDetails = {
  id: number;
  name: string;
  email: string;
  password: string;
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
      return {id: parsedData.id, name: parsedData.firstName, email: parsedData.email, password: parsedData.password};
    }
    return null;
  };

  const PolicyCard: React.FC<{ policy: Policy }> = ({ policy }) => {
      const [user, setUser] = useState<UserDetails | null>(null);

      useEffect(() => {
        const userDetails = loadUserDetails();
        setUser(userDetails);
      }, []);
    
      const handleEnrollPolicy = async (policyId: string) => {
        try{
          const enrollPolicyResponse = await fetch(`http://localhost:8080/api/v1/policy?policyId=${policyId}&userId=${user?.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if(enrollPolicyResponse.ok) {
            alert('User enrolled to policy successfully!');
          }
          else{
            alert('User already enrolled to this policy');
          }
        }
        catch(err) {
          console.log('Request cannot be processed, something went wrong ', err);
        }
      };
    
    return (
      <div className="policy-card border rounded shadow p-4 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold">{policy.policyName}</h2>
        </div>
        <p className="text-gray-600">{policy.company}</p>
        <p>Cover: {policy.cover}</p>
        <p>{policy.category}</p>
        <p>Claim Settled: <b>{policy.claimPercent}%</b></p>
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={() => handleEnrollPolicy(policy.id)}>
          ${policy.totalPremium}/month
        </button>
      </div>
  )};
  
  const PolicyList: React.FC = () => {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      // Fetch data from the Spring Boot API
      const fetchPolicies = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/v1/policy/'); // Replace with your API endpoint
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
  
      fetchPolicies();
    }, []);
  
    if (loading) {
      return <p className="text-center text-gray-500">Loading policies...</p>;
    }
  
    if (policies.length === 0) {
      return <p className="text-center text-gray-500">No policies available.</p>;
    }
  
    return (
      <div className="policy-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {policies.map((policy) => (
          <PolicyCard key={policy.id} policy={policy} />
        ))}
      </div>
    );
  };
  
  const Homepage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
      console.log("Logging out...");
      sessionStorage.clear();
      navigate("/");
    }

    const handleProfile = () => {
      console.log("my profile...");
      navigate("/myprofile");
    }
    
    return (
    <div className="app-container font-sans bg-gray-100 min-h-screen">
      <header className="bg-white shadow p-4 text-2xl font-bold">
        <div>
          ABC Insurance
        </div>
        <div className="links">
          <div className="link" onClick={handleProfile}>
            Profile
          </div>
          <div className="link" onClick={handleLogout}>
            Logout
          </div>
        </div>
      </header>
      <main className="p-6">
        <PolicyList />
      </main>
    </div>
  );
};
  
  export default Homepage;