import { useState, useEffect, useRef } from "react"

import userIcon from './user2.png';
import assistantIcon from './chatbot2.png';

const App = () => {
  const [value, setValue] = useState(null)
  

  const [sidebarVisible, setSidebarVisible] = useState(true);

const toggleSidebar = () => {
  setSidebarVisible(!sidebarVisible);
};
  
  const [isLoading, setIsLoading] = useState(false);

  const endOfMessagesRef = useRef(null);
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  

const [currentChatId, setCurrentChatId] = useState(0);

  const [chats, setChats] = useState([{
    id: 0,
    messages: []
  }]);
  
  

  const handleFormSubmit = async (e) => {
    // prevent the form from causing the page to refresh
    e.preventDefault();

    // Don't send if the user hasn't typed anything
    if (!value) return;


    // call the getMessages function
    await getMessages();
  }

  const handleKeyPress = (e) => {
    // If the enter key is pressed, run the handleFormSubmit function
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleFormSubmit(e);
    }
};

  

  const createNewChat = () => {
    setChats(prevChats => [...prevChats, { id: prevChats.length, messages: [] }]);
    setCurrentChatId(chats.length); // set new chat as current
  }

  const getMessages = async () => {

    // Don't send if the user hasn't typed anything
    if (!value) return;

    setIsLoading(true);

    const messageFromUser = { role: "user", content: value };

    // Immediately add the user's message to the current chat
    setChats(chats => chats.map(chat => 
        chat.id === currentChatId 
            ? { ...chat, messages: [...chat.messages, messageFromUser] } 
            : chat
    ));
    setValue("");

    const options = {
        method: "POST",
        body: JSON.stringify({
            messages: chats.find(chat => chat.id === currentChatId).messages.concat(messageFromUser), 
        }, null, 2).trim(),
        headers: {
            "Content-Type": "application/json"
        }
    }
    
    try {
        const response = await fetch("https://chatbot-4r0s.onrender.com/", options)
        const data = await response.json();

        const messageFromAI = { role: "assistant", content: data.choices[0].message.content };
        setChats(chats => chats.map(chat => 
            chat.id === currentChatId 
              ? { ...chat, messages: [...chat.messages, messageFromAI] } 
              : chat
        ));
    } catch (error) {
        console.error(error);
    } 
    setIsLoading(false);
}

useEffect(() => {
  const spanElements = document.querySelectorAll('.loading span');
  spanElements.forEach((span, index) => {
    span.style.animationDelay = `${index * 0.4}s`;
    span.style.opacity = 1;
  });
}, []);


useEffect(() => {
  scrollToBottom();
}, [chats]);


  


  return (
    <div className="App">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
      =
    </button>
<section className={`side-bar ${!sidebarVisible ? 'hidden' : ''}`}>

        <button className="new-chat-button" onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
  {chats.map((chat, index) => 
    <li key={index} onClick={() => setCurrentChatId(chat.id)}>
      Chat {index + 1}
    </li>
  )}
</ul>

        <nav>
          <p>Made by CreativeIsaiah</p>
        </nav>
  </section>
      <section className={`main ${!sidebarVisible ? 'collapsed' : ''}`} >
      
        {<h1>Chat-Bot  V.1</h1>}
        
        <ul className="feed">
        
            {chats.find(chat => chat.id === currentChatId).messages.map((chatMessage, index) => (
              <li key={index}>
                <img 
      src={chatMessage.role === 'user' ? userIcon : assistantIcon} 
      alt={chatMessage.role}
      style={{ width: '40px', height: '40px', borderRadius: '25px' }}
    />
                {/* <p className={chatMessage.role}>{chatMessage.role.charAt(0).toUpperCase() + chatMessage.role.slice(1)}</p> */}
                <pre>{chatMessage.content}</pre>
              </li>
            ))}
            
            {isLoading && <p className="loading"><span>L</span>
  <span>o</span>
  <span>a</span>
  <span>d</span>
  <span>i</span>
  <span>n</span>
  <span>g</span>
  <span>.</span>
  <span>.</span>
  <span>.</span></p>}
            <div ref={endOfMessagesRef} />

        </ul>
        <div className="bottom-section">
          <div className="input-container">
          <form onSubmit={handleFormSubmit}>
              <textarea 
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
                style={{resize: 'none'}} 
                onKeyDown={handleKeyPress}
                placeholder="Input text here"
              />
              <button id="submit" onClick={getMessages}>➢</button>
          </form>

          </div>
          <p className="info">
            
          </p>
        </div>
      </section>
    </div>
  );
  
}

export default App;
