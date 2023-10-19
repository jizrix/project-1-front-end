import axios from 'axios';
import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { LuFileEdit } from 'react-icons/lu';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
  },
};

const MasterTable = () => {
  //modal
  const [modalIsOpen, setIsOpen] = useState(false);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);

  //ข้อมูลAPI
  const [hn, setHN] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  //ข้อมูลใหม่สำหรับ Add
  const [new_hn, setNewHN] = useState('');
  const [new_firstName, setNewFirstName] = useState('');
  const [new_lastName, setNewLastName] = useState('');
  const [new_phone, setNewPhone] = useState('');
  const [new_email, setNewEmail] = useState('');

  //ข้อมูลจาก Backend
  const [reload, setReload] = useState(false);
  const [apiData, setAPIData] = useState([]);

  //ส่วน Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(apiData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = apiData.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  //Fetch ข้อมูล
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get('https://project-1-back-end.onrender.com/');
      setAPIData(response.data);
    };
    getData();
  }, [reload]);

  // modal handler
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setAddModalIsOpen(false);
  };

  const addHandler = () => {
    // reset ค่า state กรณีกด cancel ไป
    setNewHN('');
    setNewFirstName('');
    setNewLastName('');
    setNewPhone('');
    setNewEmail('');

    setIsOpen(false);
    setAddModalIsOpen(true);
  };

  const addNewHandler = async () => {
    console.log('add new click');
    console.log(`
    hn : ${new_hn} \n
    firstName : ${new_firstName} \n
    lastName : ${new_lastName} \n
    phone : ${new_phone} \n
    email : ${new_email} \n
     `);
    const data = {
      hn: new_hn,
      firstname: new_firstName,
      lastname: new_lastName,
      phone: new_phone,
      email: new_email,
    };

    const response = await axios.post('https://project-1-back-end.onrender.com/add', data);
    if (response.status === 200) {
      alert('เพิ่มเรียบร้อย');
    } else {
      alert(`ติดปัญหา : ${response.status}`);
    }
    closeModal();
    setReload(!reload);
  };

  const updateHandler = async () => {
    console.log('update click');
    const data = {
      hn: hn,
      firstname: firstName,
      lastname: lastName,
      phone: phone,
      email: email,
    };
    const response = await axios.put('https://project-1-back-end.onrender.com/update', data);
    if (response.status === 200) {
      alert('อัพเดทเรียบร้อย');
    } else {
      alert(`ติดปัญหา : ${response.status}`);
    }
    closeModal();
    setReload(!reload);
  };

  const deleteHandler = async () => {
    console.log('delete click');
    const response = await axios.delete(`https://project-1-back-end.onrender.com/delete/${hn}`);
    if (response.status === 200) {
      alert('ลบเรียบร้อย');
    } else {
      alert(`ติดปัญหา : ${response.status}`);
    }
    closeModal();
    setReload(!reload);
  };

  const editHandler = (data) => {
    setHN(data.hn);
    setFirstName(data.firstname);
    setLastName(data.lastname);
    setPhone(data.phone);
    setEmail(data.email);

    openModal();
    console.log('edit click : ');
  };


  return (
    <>
      {/* modal section */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel='Edit Modal'
      >
        <div>เจ้าของ</div>
        <form className='space-y-6'>
          <section
            id='first-row'
            className='flex felx-row justify-evenly gap-5'
          >
            <div>
              <label
                htmlFor='hn'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                HN
              </label>
              <div className='mt-2'>
                <input
                  name='hn'
                  type='text'
                  required
                  value={hn}
                  onChange={(e) => setHN(e.target.value)}
                  className='block w-full rounded-md border-0 py-1.5 px-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300
                  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  disabled
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='firstname'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                ชื่อ
              </label>
              <div className='mt-2'>
                <input
                  name='firstname'
                  type='text'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className='block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='lastname'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                นามสกุล
              </label>
              <div className='mt-2'>
                <input
                  name='lastname'
                  type='text'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className='block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  required
                />
              </div>
            </div>
          </section>

          <section
            id='second-row'
            className='flex felx-row justify-start gap-5'
          >
            <div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='phone'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  เบอร์ติดต่อ
                </label>
              </div>
              <div className='mt-2'>
                <input
                  name='phone'
                  type='text'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className='block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  required
                />
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  อิเมล์
                </label>
              </div>
              <div className='mt-2'>
                <input
                  id='email'
                  name='email'
                  type='text'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  required
                />
              </div>
            </div>
          </section>

          <section
            id='third-row'
            className='flex felx-row justify-center gap-3 px-[5rem]'
          >
            <button
              onClick={() => closeModal()}
              type='button'
              className='flex w-full justify-center rounded-md bg-slate-200 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              ⬅️ Cancel
            </button>
            <button
              onClick={() => addHandler()}
              type='button'
              className='flex w-full justify-center rounded-md bg-blue-100 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              ➕ Add
            </button>
            <button
              onClick={() => updateHandler()}
              type='button'
              className='flex w-full justify-center rounded-md bg-blue-100 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              ➕ Save
            </button>
            <button
              onClick={() => deleteHandler()}
              type='button'
              className='flex w-full justify-center rounded-md bg-slate-200 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              ❌ Delete
            </button>
          </section>
        </form>
      </Modal>

      {/* ส่วนเพิ่มใหม่ Add new */}
      <Modal
        isOpen={addModalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel='Edit Modal'
      >
        <div>เพิ่ม เจ้าของ ใหม่</div>
        <form className='space-y-6'>
          <section
            id='first-row'
            className='flex felx-row justify-evenly gap-5'
          >
            <div>
              <label
                htmlFor='hn'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                HN
              </label>
              <div className='mt-2'>
                <input
                  name='hn'
                  type='text'
                  required
                  value={new_hn}
                  onChange={(e) => setNewHN(e.target.value)}
                  className='block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='firstname'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                ชื่อ
              </label>
              <div className='mt-2'>
                <input
                  name='firstname'
                  type='text'
                  value={new_firstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  className='block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='lastname'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                นามสกุล
              </label>
              <div className='mt-2'>
                <input
                  name='lastname'
                  type='text'
                  value={new_lastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  className='block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  required
                />
              </div>
            </div>
          </section>

          <section
            id='second-row'
            className='flex felx-row justify-start gap-5'
          >
            <div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='phone'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  เบอร์ติดต่อ
                </label>
              </div>
              <div className='mt-2'>
                <input
                  name='phone'
                  type='text'
                  value={new_phone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className='block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  required
                />
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  อิเมล์
                </label>
              </div>
              <div className='mt-2'>
                <input
                  id='email'
                  name='email'
                  type='text'
                  value={new_email}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className='block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  required
                />
              </div>
            </div>
          </section>

          <section
            id='third-row'
            className='flex felx-row justify-center gap-3 px-[5rem]'
          >
            <button
              onClick={() => closeModal()}
              type='button'
              className='flex w-full justify-center rounded-md bg-slate-200 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              ⬅️ Cancel
            </button>

            <button
              onClick={() => addNewHandler()}
              type='button'
              className='flex w-full justify-center rounded-md bg-blue-100 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              ➕ Add New
            </button>
          </section>
        </form>
      </Modal>

      <div className='flex flex-row justify-center items-center w-full min-h-screen'>
        {/* table section   */}
        <div className=''>
          <div>
            <div className='text-black text-[2rem]'>ค้นหาเจ้าของ</div>
            <div className='bg-green-500 h-[3px] mb-5'></div>
          </div>
          <div className='overflow-x-auto w-[50rem] h-96 border-2 border-gray-300'>
            <table className='w-full table-auto'>
              <thead className='sticky top-0'>
                <tr>
                  <th className='text-base text-black font-medium'>
                    Operation
                  </th>
                  <th className='text-base text-black font-medium'>
                    HN เจ้าของ
                  </th>
                  <th className='text-base text-black font-medium'>
                    ชื่อเจ้าของ
                  </th>
                  <th className='text-base text-black font-medium'>
                    เบอร์ติดต่อ
                  </th>
                  <th className='text-base text-black font-medium'>
                    อิเมล์
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((data) => (
                  <tr key={data.hn}>
                    <td className='flex felx-row justify-center'>
                      <button
                        className='border-2 py-1 px-2 bg-base-200'
                        onClick={() => editHandler(data)}
                      >
                        <LuFileEdit size={20} />
                      </button>
                    </td>
                    <td>{data.hn}</td>
                    <td
                      className='cursor-pointer text-blue-800'
                      onClick={() => editHandler(data)}
                    >
                      {data.firstname + '  ' + data.lastname}
                    </td>
                    <td>{data.phone}</td>
                    <td>{data.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination buttons */}
          <div className='flex flex-row justify-center items-center bg-base-200 border-2 border-base-300'>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                className='px-2 py-1 my-2 hover:outline hover:outline-1 hover:outline-base-300 hover:bg-blue-100'
                key={index}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MasterTable;
