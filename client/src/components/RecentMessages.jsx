import React from 'react'
import { dummyRecentMessagesData } from '../assets/assets';
import { Link } from 'react-router-dom';
import moment from 'moment';

const RecentMessages = () => {
    const[messages,setMessages]=React.useState([]);
    const fetchMessages=async()=>{
        setMessages(dummyRecentMessagesData);
    }
    React.useEffect(()=>{
        fetchMessages();
    },[])
  return (
    <div className='bg-white max-w-xs mt-4 p-4 rounded-md shadow space-y-4 min-h-20 text-xs text-slate-800'>
   <h3 className='font-semibold text-slate-800 mb-4'> Recent messages</h3>
   <div className='flex flex-col max-h-56 overflow-y-scroll no-scrollbar'>
    {
        messages.map((messages, index)=>(
            <Link to={`/messages/${messages.from_user_id.id}`} key={index} className='flex
             items-start gap-2 py-2 hover:bg-slate-100'>
            <img src={messages.from_user_id.profile_picture} alt="" className='w-8 h-8 rounded-full' />
            <div className='w-full'>
                  <div className='flex justify-between'>
                <h3 className='font-medium text-slate-800'>{messages.from_user_id.full_name}</h3>
                <p className='text-[10px] text-slate-600'>{moment(messages.createdAt).fromNow()}</p>
            </div>

            <div className='flex justify-between'>
                <p>{messages.text ? messages.text: 'media'}</p>
                {!messages.seen && <p className='bg-indigo-500 text-white
                w-4 h-4 flex items-center justify-center rounded-full text-[10px]'>1</p>}
            </div>
            </div>
          
            </Link>
        ))
    }

   </div>
    </div>
  )
}

export default RecentMessages