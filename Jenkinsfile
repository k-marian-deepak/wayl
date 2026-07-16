pipeline {
    agent any

    // Use the Node.js tool configuration defined in the Jenkins Global Tool Configuration
    tools {
        nodejs 'NodeJS 22.x.x'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout code from Git repository
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                // Navigate into the frontend folder and run the build scripts
                dir('frontend') {
                    echo 'Installing node modules...'
		    // --prefered-offline forces npm to use the local npm cache by the agent/slave rather than pinging the online server for updates
                    sh 'npm install --prefer-offline'
                    
                    echo 'Compiling static bundle...'
                    sh 'npm run build'
                }
            }
        }

        stage('Archive Build Artifacts') {
            steps {
                // Archive the generated static HTML/CSS/JS build files so you can download them from the Jenkins UI
                archiveArtifacts artifacts: 'frontend/dist/**/*', onlyIfSuccessful: true
            }
        }
    }
}
