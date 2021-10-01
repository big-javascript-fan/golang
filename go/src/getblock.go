package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"log"
	"encoding/json"
	"github.com/gorilla/mux"
	"strconv"
)

func main() {

    r := mux.NewRouter()
	r.Use(commonMiddleware)

    r.HandleFunc("/api/block/{id}", getBlock).Methods("GET")

    log.Fatal(http.ListenAndServe(":8000", r))
}

func commonMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Add("Content-Type", "application/json")
        next.ServeHTTP(w, r)
    })
}

func getBlock(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
    id, ok := vars["id"]
    if !ok {
        fmt.Println("id is missing in parameters")
    }
	hexId := "latest";
	if id != "latest" {
		i, err := strconv.ParseInt(id, 10, 64)
		if err != nil {
			panic(err)
		}
		hexId = "0x" + strconv.FormatInt(i, 16)
	}
    fmt.Println(`hexId := `, hexId)
    httpposturl := "https://cloudflare-eth.com"
	fmt.Println("HTTP JSON POST URL:", httpposturl)

	var jsonData = []byte(`{
            "jsonrpc": "2.0",
            "method": "eth_getBlockByNumber",
            "params": ["`+hexId+`",true],
            "id": 1
	}`)
	request, error := http.NewRequest("POST", httpposturl, bytes.NewBuffer(jsonData))
	request.Header.Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	client := &http.Client{}
	response, error := client.Do(request)
	if error != nil {
		panic(error)
	}
	defer response.Body.Close()

	fmt.Println("response Status:", response.Status)
	fmt.Println("response Headers:", response.Header)
	body, _ := ioutil.ReadAll(response.Body)
	// fmt.Println("response Body:", string(body))
    var buffer bytes.Buffer
	buffer.Write(body)
	json.NewEncoder(w).Encode(buffer.String())
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	return
}