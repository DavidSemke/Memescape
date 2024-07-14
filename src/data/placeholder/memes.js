export default memes = [
    {
        id: '410544b2-4001-4271-9855-fec4b6a6442a',
        template_id: 'see? nobody cares',
        user_id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
        text: [
            'this guy made a meme creator app!',
            'see? nobody cares'
        ],
        private: false,
        product_image: fs.readFileSync('./images/nobody_cares.png'),
        create_date: Date.now()
    },
    {
        id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
        template_id: 'sweet brown',
        user_id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
        text: [
            'terms of service?',
            'ain\'t nobody got time for that'
        ],
        private: false,
        product_image: fs.readFileSync('./images/aint_got_time.png'),
        create_date: Date.now()
    },
    {
        id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
        template_id: 'ancient aliens guy',
        user_id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
        text: [
            'i am not saying it was aliens',
            'but it was aliens'
        ],
        private: true,
        product_image: fs.readFileSync('./images/aag.png'),
        create_date: Date.now()
    }
]