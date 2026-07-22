pipeline {
    agent any

    environment {
        // Redirect home directory to the workspace to avoid permission issues with /home/jenkins
        HOME = "${WORKSPACE}"
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
                    sh 'npm install --prefer-offline --fetch-timeout=600000'
                    
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

        stage('PR Merge Verification') {
            when {
                // Only run this stage when building a Pull Request (PR)
                changeRequest()
            }
            steps {
                echo "Verifying PR #${env.CHANGE_ID}: ${env.CHANGE_TITLE}"
                echo "Source branch: ${env.CHANGE_BRANCH} -> Target branch: ${env.CHANGE_TARGET}"
            }
        }

        stage('Deploy') {
            when {
                allOf {
                    anyOf {
                        // Execute this stage if branch is 'main' OR matches 'fix-*'
                        branch 'main'
                        branch 'fix-*'
                        branch 'doc-*'
                    }
                    // Exclude pull request builds (only deploy on actual branch pushes/merges)
                    not { changeRequest() }
                }
            }
            steps {
                echo "Running deployment steps for branch ${env.BRANCH_NAME}..."
            }
        }
    }

    post {
        always {
            echo 'Skipping automatic workspace cleanup...'
            // cleanWs()
        }
    }
}
