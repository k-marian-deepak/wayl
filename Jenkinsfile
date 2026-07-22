pipeline {
    agent any

    environment {
        HOME = "${WORKSPACE}"
    }

    stages {
        // Stage 1: Triggers ONLY when an open Pull Request is raised/updated
        stage('PR Raised Notification') {
            when {
                changeRequest() // Matches active PR builds
            }
            steps {
                echo "📢 A PR HAS BEEN RAISED!"
                echo "PR #${env.CHANGE_ID}: ${env.CHANGE_TITLE}"
                echo "Source: ${env.CHANGE_BRANCH} ➔ Target: ${env.CHANGE_TARGET}"
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    echo 'Installing node modules...'
                    sh 'npm install --prefer-offline --fetch-timeout=600000'
                    
                    echo 'Compiling static bundle...'
                    sh 'npm run build'
                }
            }
        }

        stage('Archive Build Artifacts') {
            steps {
                archiveArtifacts artifacts: 'frontend/dist/**/*', onlyIfSuccessful: true
            }
        }

        // Stage 2: Triggers ONLY when code is merged into main (or pushed directly)
        stage('PR Merged Notification') {
            when {
                allOf {
                    branch 'main'
                    not { changeRequest() } // Excludes open PRs targeting main
                }
            }
            steps {
                // Read the commit message to see if it was a PR merge
                script {
                    def commitMessage = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                    if (commitMessage.contains('Merge pull request')) {
                        echo "🎉 A PULL REQUEST WAS MERGED INTO MAIN!"
                        echo "Commit Message: ${commitMessage}"
                    } else {
                        echo "🚀 Direct commit pushed to main: ${commitMessage}"
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                allOf {
                    anyOf {
                        branch 'main'
                        branch 'fix-*'
                        branch 'doc-*'
                    }
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
        }
    }
}