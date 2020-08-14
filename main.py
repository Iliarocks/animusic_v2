from flask import Flask, render_template

app = Flask(__name__);

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/anime/<anime>')
def anime(anime):
    return render_template('anime.html', anime=anime)

if __name__ == '__main__':
    app.run(debug=True)
