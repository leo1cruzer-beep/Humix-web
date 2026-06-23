import { useParams, useNavigate } from 'react-router-dom'
import { ClarityHome } from '../screens/clarity/index.jsx'
import DebtFreedom from '../screens/clarity/DebtFreedom.jsx'
import WealthBuilder from '../screens/clarity/WealthBuilder.jsx'
import Budget from '../screens/clarity/Budget.jsx'
import Remittance from '../screens/clarity/Remittance.jsx'
import Markets from '../screens/clarity/Markets.jsx'

export default function FinancePage() {
  const { tool } = useParams()
  const navigate = useNavigate()

  const goBack = () => navigate(-1)
  const goTo = (id) => navigate(`/finance/${id}`)

  switch (tool) {
    case 'debt':       return <DebtFreedom onBack={goBack} />
    case 'wealth':     return <WealthBuilder onBack={goBack} />
    case 'budget':     return <Budget onBack={goBack} />
    case 'remittance': return <Remittance onBack={goBack} />
    case 'markets':    return <Markets onBack={goBack} />
    default:           return <ClarityHome onNav={goTo} />
  }
}
