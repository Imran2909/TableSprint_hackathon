import React from 'react'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import styles from "./styles/dashboard.module.css"

function Dashboard() {
    return (
        <div className={styles.outr} >
            <Navbar />
            <div className={styles.cont} >
                <SideBar />
                <div className={styles.box} >
                    <div className={styles.main} >
                        <img src="https://s3-alpha-sig.figma.com/img/d59b/e01f/869311531ee26032e175620e2d0b5059?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=j~Tf~IY5yO0R~kHxm635hlPX5H4VUMJ-ARaGX4JsMH-bxejS2-yKQOiFhdc2j2kwTmB8YtEiMs6olPRfdNyxNzegajnxZzNzWtBC~qvvnv53fvvNOaNIXPwCibsxRohWMgtAmfPCLGcMbjHFVynCS-IDOK6jOpB1LIHzEoSppFVZXSJ27u7INJaKWORhVEe9b4RFVJ2AC-K5XVcD83w01woy4sWg9pDE0~RphkV92yjExZ7zVQdZ97NwSNkdwIn8PTdxytJnayUDGfwfZoDkvZcKwbxi2L3wuHOie0v3gIMQpcBxvS8MkcMbTmUWy-eZY~AbDUFUuTq8ibICm5sXuA__" alt="" />
                        <p>Welcome to TableSprint admin</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
