import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './Components/Home'; // Ensure correct export/import
import Layout from './Components/Layout'; // Ensure correct export/import
import DonorLayout from './Components/DonorLayout'; // Ensure correct export/import
import DonationTrends from './Components/DonationTrends'; // Ensure correct export/import

import AdminLayout from './Components/AdminLayout'; // Ensure correct export/import
import DonationData from './Components/DonationData'; // Ensure correct export/import

import About from './Components/About';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Services from './Components/Services';
import Campaign from './Components/Campaign';
import Gallery from './Components/Gallery';
import Contact from './Components/Contact';
import DonorHome from './Components/DonorHome';

import AdminHome from './Components/AdminHome';
import Charities from './Components/Charities';
import ContactDonor from './Components/ContactDonor';
import CampaignDonor from './Components/CampaignDonor';
import DonorAccount from './Components/DonorAccount'; // Ensure correct export/import
import AdminAccount from './Components/AdminAccount'; // Ensure correct export/import
import CampaignAdmin from './Components/CampaignAdmin'; // Ensure correct export/import
import ManageCharities from './Components/ManageCharities'; // Ensure correct export/import
import TrackDonations from './Components/TrackDonations'; // Ensure correct export/import
import GenerateReports from './Components/GenerateReports'; // Ensure correct export/import

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="about" element={<Layout><About /></Layout>} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="services" element={<Layout><Services /></Layout>} />
        <Route path="campaign" element={<Layout><Campaign /></Layout>} />
        <Route path="gallery" element={<Layout><Gallery /></Layout>} />
        <Route path="contact" element={<Layout><Contact /></Layout>} />
        <Route path="donor-home" element={<DonorLayout><DonorHome /></DonorLayout>} />

        <Route path="donation-trends" element={<DonorLayout><DonationTrends /></DonorLayout>} />
        <Route path="charities" element={<DonorLayout><Charities /></DonorLayout>} />
        <Route path="contactdonor" element={<DonorLayout><ContactDonor /></DonorLayout>} />
        <Route path="campaigndonor" element={<DonorLayout><CampaignDonor /></DonorLayout>} />

        <Route path="admin-home" element={<AdminLayout><AdminHome /></AdminLayout>} />
        <Route path="campaignadmin" element={<AdminLayout><CampaignAdmin /></AdminLayout>} />

        <Route path="adminaccount" element={<AdminLayout><AdminAccount /></AdminLayout>} />
        <Route path="donation-data" element={<AdminLayout><DonationData/></AdminLayout>} />
        <Route path="managecharities" element={<AdminLayout><ManageCharities/></AdminLayout>} />
        <Route path="generatereports" element={<AdminLayout><GenerateReports/></AdminLayout>} />

        <Route path="donoraccount" element={<DonorLayout><DonorAccount/></DonorLayout>} />
        <Route path="track-donations" element={<DonorLayout><TrackDonations/></DonorLayout>} />

      </Routes>
    </div>
  );
}

export default App;
