import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hi! I'm the REP Fitness Home Gym Builder 💪\n\nI'll help you put together the perfect home gym based on your budget, space, and goals.\n\nWhat is your total budget for the gym?"
    }
  ])
  const [input, setInput] = useState('')
  const [step, setStep] = useState('budget') // budget → space → goals → summary
  const [answers, setAnswers] = useState({
    budget: '',
    space: '',
    goals: ''
  })
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addMessage = (sender, text) => {
    setMessages(prev => [...prev, { id: Date.now(), sender, text }])
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userText = input.trim()
    addMessage('user', userText)
    setInput('')

    // Simple conversation logic
    setTimeout(() => {
      if (step === 'budget') {
        setAnswers(prev => ({ ...prev, budget: userText }))
        addMessage('bot', `Got it — budget around $${userText}.\n\nWhat kind of space do you have?\n\n• Small room / apartment\n• Garage bay\n• Basement\n• Large dedicated space\n\nJust type one of those (or describe it).`)
        setStep('space')
      } 
      else if (step === 'space') {
        setAnswers(prev => ({ ...prev, space: userText }))
        addMessage('bot', `Perfect. Space: ${userText}.\n\nWhat are your main training goals?\n\n• Strength / Powerlifting\n• Bodybuilding / Muscle building\n• General fitness\n• Functional / Hybrid training\n\nType the one that fits best.`)
        setStep('goals')
      } 
      else if (step === 'goals') {
        setAnswers(prev => ({ ...prev, goals: userText }))
        
        // Simple recommendation based on budget
        let recommendation = ''
        const budgetNum = parseInt(answers.budget) || 0

        if (budgetNum < 1000) {
          recommendation = `Based on a budget under $1,000, I recommend the **Trailhead Home Gym Package** centered around the PR-1100 power rack.\n\nThis includes:\n• PR-1100 Power Rack\n• Choice of flat or adjustable bench\n• Delta Basic Bar\n• Bumper or iron plates\n\nWould you like me to walk you through the color and variant options next?`
        } else if (budgetNum < 2500) {
          recommendation = `With a mid-range budget, the **PR-4000** is an excellent choice — great value and lots of attachment options.\n\nTypical setup:\n• PR-4000 Power Rack\n• Adjustable bench (Nighthawk or BlackWing)\n• Colorado or Black Diamond bar\n• Bumper plates + adjustable dumbbells\n\nReady to pick colors and exact variants?`
        } else {
          recommendation = `With a higher budget we can go premium: **PR-5000 + Ares 2.0** cable system.\n\nThis is a fully expandable, future-proof home gym.\n\nWant me to start configuring the exact variants (height, color, attachments, etc.)?`
        }

        addMessage('bot', recommendation)
        setStep('summary')
      } 
      else {
        addMessage('bot', "Thanks! This is the prototype. In the full version we would now let you pick colors, rack height, bench model, plate type, and more.\n\nYou can type 'restart' to start over.")
        if (userText.toLowerCase() === 'restart') {
          setMessages([{
            id: Date.now(),
            sender: 'bot',
            text: "Hi! I'm the REP Fitness Home Gym Builder 💪\n\nWhat is your total budget for the gym?"
          }])
          setStep('budget')
          setAnswers({ budget: '', space: '', goals: '' })
        }
      }
    }, 600)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>REP Fitness Home Gym Builder</h1>
        <p>Prototype for interview</p>
      </header>

      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="bubble">
              {msg.text.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your answer..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default App