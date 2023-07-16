"use client"
import React, { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";
import "@/flow/config";

const SendPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);

  const getProfileData = async () => {
    const profileData = await fcl.query({
      cadence: `
        import Library from 0xf41fd3cb80a5dce4

        pub fun main(): [{Address: Library.Profile}] {
          return Library.getAllProfiles()
        }
      `,
    });
    const transformedData = profileData.map((obj) => {
      const [address, value] = Object.entries(obj)[0];
      return { address, ...value };
    });
    return transformedData;
  };

  useEffect(async () => {
    const profileData = await getProfileData();
    setProfiles(profileData);
    setFilteredProfiles(profileData);
    setIsLoading(false);
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const searchedProfiles = profiles.filter(
      (profile) =>
        profile?.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile?.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProfiles(searchedProfiles);
  };

  const toggleSelect = (index) => {
    const updatedProfiles = [...filteredProfiles];
    updatedProfiles[index].isSelected = !updatedProfiles[index].isSelected;
    setFilteredProfiles(updatedProfiles);

    const selectedProfile = updatedProfiles[index];
    if (selectedProfile.isSelected) {
      setSelectedProfiles((prevSelectedProfiles) => [
        ...prevSelectedProfiles,
        selectedProfile.address,
      ]);
    } else {
      setSelectedProfiles((prevSelectedProfiles) =>
        prevSelectedProfiles.filter(
          (address) => address !== selectedProfile.address
        )
      );
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-center my-5">
        <input
          type="text"
          placeholder="Search people by their names or description"
          className="px-4 py-3 bg-gray-100 text-gray-700 border rounded min-w-3/5 outline-none leading-tight focus:outline-none focus:border-gray-500 focus:bg-white text-base"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-10 mb-10">
        {isLoading ? (
          <div className="flex col-span-3 items-center justify-center mt-20">
            Loading..
          </div>
        ) : (
          filteredProfiles.map((profile, index) => (
            <div
              key={index}
              className="bg-gray-100 shadow-md rounded-lg p-4 flex flex-col justify-between mt-5"
            >
              <div>
                <img
                  src={profile?.avatar}
                  alt="profileimg"
                  className="w-40 h-40 rounded-full mx-auto"
                />
                <h2 className="text-xl font-bold mt-4 text-center">
                  {profile?.fullname}
                </h2>
                <p className="text-gray-600 text-center">
                  {profile?.username}
                </p>
              </div>
              <div className="flex flex-col items-center mt-3">
                <a
                  href={`https://flocial.vercel.app/profile/${profile?.address}`}
                  className="text-blue-500 font-semibold mb-5"
                >
                  View Profile
                </a>
                <button
  className={`bg-${profile.isSelected ? 'red' : 'blue'}-500 hover:bg-${profile.isSelected ? 'red' : 'blue'}-700 text-white font-bold py-2 px-4 rounded`}
  onClick={() => toggleSelect(index)}
>
  {profile.isSelected ? "Remove" : "Select"}
</button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mb-28">
        <h2 className="">Selected Profiles:</h2>
        {selectedProfiles.map((address, index) => (
      
          <div key={index} className="">{address}</div>
         
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center bg-white p-4">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => console.log("Proceed clicked")}
          disabled={selectedProfiles.length === 0}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default SendPage;