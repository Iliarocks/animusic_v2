from flask import Flask, render_template

app = Flask(__name__);

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sign-up')
def get_started():
    return render_template('login.html', new_path='/sign-in', action='Sign up', link='Sign in', question="Already have an account? ", title='Create account')

@app.route('/sign-in')
def login():
    return render_template('login.html', new_path='/sign-up', action='Sign in', link='Sign up', question="Don't have an account? ", title='Welcome back')

@app.route('/anime/<anime>')
def anime(anime):
    return render_template('anime.html', anime=anime)

if __name__ == '__main__':
    app.run(debug=True)
