from flask import Flask, render_template
import random, string

app = Flask(__name__, static_folder= "asset")

@app.route('/')
def index():
    return render_template('index.html', rid = ''.join([random.choice(string.digits) for i in range(6)]))


app.run(host = "0.0.0.0", port = 12001, debug = True)