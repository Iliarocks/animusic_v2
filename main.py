from flask import Flask, render_template

app = Flask(__name__);

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/account')
def settings():
    return render_template('account.html')

@app.route('/sign-up')
def sign_up():
    return render_template('login.html', action_opp='sign in', action='sign up', new_path='/sign-in')

@app.route('/sign-in')
def sign_in():
    return render_template('login.html', action_opp='sign up', action='sign in', new_path='/sign-up')

@app.route('/genre/<genre>')
def genre(genre):
    return 'This is the genre page for ' + genre

if __name__ == '__main__':
    app.run(debug=True)
