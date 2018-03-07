{
  "targets": [
    {
      "target_name": "frk",
      "sources": [
        "src/frk.cc"
      ],
      "include_dirs": ["<!(node -e \"require('nan')\")"]
    }
  ]
}
