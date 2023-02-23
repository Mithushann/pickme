
import styles from '@/styles/Home.module.css'
import Visualizations from '@/pages/Visualizations'

export default function Home() {
  return (
    
    // You might need to give the userType as a prop to the TrajectoryPlot component
    // <Visualizations userType={this.state.userType} />
    // There is two types of user 1) customer 2)employee

    <Visualizations userType="customer"></Visualizations>  
  )
}
