import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import authStore from "../features/authStore";
import {
  IoPersonSharp,
  IoPeopleOutline,
  IoDocumentTextSharp,
  IoCheckmarkDoneSharp,
  IoKeyOutline,
  IoWalletOutline,
} from "react-icons/io5";

const Welcome = () => {
  const { user } = authStore();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userEmail = Cookies.get("userEmail");

  const fetchData = async () => {
    try {
      if (!user) return;

      setLoading(true);

      if (user.role === "adminsistem") {
        const users = await axios.get("http://34.142.169.61:5000/api/users/findAllUsers");
        const usersWithCA = users.data.data.filter((u) => u.wallet === "TRUE").length;
        const usersWithoutCA = (await axios.get("http://34.142.169.61:5000/api/users/findAllUsersWithoutCA")).data.data.length;

        setStats({
          totalUsers: users.data.data.length,
          usersWithCA,
          usersWithoutCA,
        });
      } else if (user.role === "adminpelayanan") {
        const totalPasien = (await axios.get("http://34.142.169.61:5000/api/users/findAllPasien")).data.data.length;
        const totalDokter = (await axios.get(`http://34.142.169.61:5000/api/users/findAllDokterByIdPelayanan?idPelayanan=${user.idRole}`)).data.data.length;

        setStats({
          totalPasien,
          totalDokter,
        });
      } else if (user.role === "dokter") {
        const rekamMedis = (await axios.get("http://34.142.169.61:5000/api/rekamMedis/GetAllRekamMedisByDokterIdFilteredHakAksesTrue")).data.data.length;
        const pemeriksaan = (await axios.get(`http://34.142.169.61:5000/api/users/findAllPemeriksaanByNIPDokter?nip=${user.idRole}`)).data.data.filter(
          (item) => item.selesai === "BelumSelesai"
        ).length;

        setStats({
          rekamMedis,
          pemeriksaan,
        });
      } 
//       else if (user.role === "pasien") {
//       const rekamMedisResponse = await axios.get("http://34.142.169.61:5000/api/rekamMedis/HistoryRekamMedisFilterByPasienLogin");
//       const hakAksesResponse = await axios.get("http://34.142.169.61:5000/api/hakAkses/GetAllhakAksesByPasienNIK");

//       const rekamMedis = rekamMedisResponse.data?.data?.length || 0;
//       const hakAkses = hakAksesResponse.data?.data?.length || 0;

//       setStats({
//         rekamMedis,
//         hakAkses,
//       });
//     }
//   } catch (err) {
//     console.error("Error fetching stats:", err);
//     // Jangan set error jika ingin menyembunyikan pesan error
//     setStats({
//       rekamMedis: 0,
//       hakAkses: 0,
//     }); // Default nilai kosong jika error
//   } finally {
//     setLoading(false);
//   }
// };

else if (user.role === "pasien") {
  const rekamMedisResponse = await axios.get("http://34.142.169.61:5000/api/rekamMedis/HistoryRekamMedisFilterByPasienLogin");
  const hakAksesResponse = await axios.get("http://34.142.169.61:5000/api/hakAkses/GetAllhakAksesByPasienNIK");

  const rekamMedis = rekamMedisResponse.data?.data?.length || 0;
  const hakAkses = hakAksesResponse.data?.data?.length || 0;

  setStats({
    rekamMedis,
    hakAkses,
  });
}
} catch (err) {
console.error("Error fetching stats:", err);
// Jangan set error jika ingin menyembunyikan pesan error
setStats({
  rekamMedis: 0,
  hakAkses: 0,
}); // Default nilai kosong jika error
} finally {
setLoading(false);
}
};

  useEffect(() => {
    fetchData();
  }, [user]);

  if (!user) {
    return (
      <div>
        <h1 className="title">Please log in to access the dashboard.</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className="notification is-danger">{error}</div>;
  }

  return (
    <div>
      {/* <h1 className="title">Dashboard</h1> */}
      <h1 className="subtitle">
        Welcome Back <strong>{user.nama}</strong>
      </h1>
  
        <div className="columns is-multiline">
          {user.role === "adminsistem" && (
            <>
              <Card
                title="Total Users"
                count={stats.totalUsers}
                icon={<IoPeopleOutline />}
              />
              <Card
                title="Users dengan CA"
                count={stats.usersWithCA}
                icon={<IoWalletOutline />}
              />
              <Card
                title="Users tanpa CA"
                count={stats.usersWithoutCA}
                icon={<IoKeyOutline />}
              />
            </>
          )}
          {user.role === "adminpelayanan" && (
            <>
              <Card
                title="Total Pasien"
                count={stats.totalPasien}
                icon={<IoPersonSharp />}
              />
              <Card
                title="Total Dokter"
                count={stats.totalDokter}
                icon={<IoPeopleOutline />}
              />
            </>
          )}
          {user.role === "dokter" && (
            <>
              <Card
                title="Rekam Medis"
                count={stats.rekamMedis}
                icon={<IoDocumentTextSharp />}
              />
              <Card
                title="Pemeriksaan"
                count={stats.pemeriksaan}
                icon={<IoCheckmarkDoneSharp />}
              />
            </>
          )}
          {user.role === "pasien" && (
            <>
              <Card
                title="Rekam Medis"
                count={stats.rekamMedis}
                icon={<IoDocumentTextSharp />}
              />
              <Card
                title="Hak Akses"
                count={stats.hakAkses}
                icon={<IoKeyOutline />}
              />
            </>
          )}
        </div>
    </div>
  );
};

const Card = ({ title, count, icon }) => (
  <div className="column is-4">
    <div className="box has-text-centered">
      <div className="icon is-large">{icon}</div>
      <h4 className="title is-4">{title}</h4>
      <p className="subtitle is-5">{count}</p>
    </div>
  </div>
);

export default Welcome;
