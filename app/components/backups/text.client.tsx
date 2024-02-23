import React from 'react'


export default function TextClient() {
  const props = {}
  return (
    <>
      <div className='flex h-[98%] '>
        <UserList />
        <MyComponent props={props} />
      </div>
    </>
  )
}

function UserList() {
  return (
    <>
      <div className="w-[300px] border rounded border-slate9 mr-3">
        <div className="w-[240px] border border-slate9 rounded ">
          <div className="p-3 items-center justify-center" >
            <img
              alt='aa'

              className="messagePic w-31 h-31 max-w-[64px] max-h-[64px] rounded-full"
              src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
            />
            <div>
              <p className='text-bold' >
                Teodros Girmay
              </p>
              <p className='text-slate8'  >
                Engineering
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
function MyComponent(props) {
  return (
    <div className="justify-center items-start shadow-sm bg-white flex flex-col rounded border border-slate9  p-3 w-full mr-3">
      <div className="bg-white self-stretch flex w-full items-stretch justify-between gap-5 pl-3.5 pr-6 py-4 max-md:max-w-full max-md:flex-wrap max-md:justify-center max-md:pr-5">
        <img
          loading="lazy"
          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/9c69b558c0bf3453d0afa4d2517a5819e53d0d104aa4ace39d1abc6858bfe2f0?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/9c69b558c0bf3453d0afa4d2517a5819e53d0d104aa4ace39d1abc6858bfe2f0?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9c69b558c0bf3453d0afa4d2517a5819e53d0d104aa4ace39d1abc6858bfe2f0?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/9c69b558c0bf3453d0afa4d2517a5819e53d0d104aa4ace39d1abc6858bfe2f0?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/9c69b558c0bf3453d0afa4d2517a5819e53d0d104aa4ace39d1abc6858bfe2f0?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9c69b558c0bf3453d0afa4d2517a5819e53d0d104aa4ace39d1abc6858bfe2f0?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/9c69b558c0bf3453d0afa4d2517a5819e53d0d104aa4ace39d1abc6858bfe2f0?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/9c69b558c0bf3453d0afa4d2517a5819e53d0d104aa4ace39d1abc6858bfe2f0?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
          className="aspect-[3.23] object-contain object-center w-[84px] overflow-hidden self-center shrink-0 max-w-full my-auto"
        />
        <div className="justify-center items-stretch flex grow basis-[0%] flex-col">
          <div className="text-zinc-800 text-sm font-semibold leading-5 whitespace-nowrap mx-auto">
            🦄 Team Unicorns
          </div>
          <div className="text-neutral-500 text-xs whitespace-nowrap mt-1 mx-auto">
            last seen 45 minutes ago
          </div>
        </div>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/5324b9a5a86ff6ea2720eb456fc20eca5df70ccac886182543fb2a408550939d?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
          className="aspect-square object-contain object-center w-4 overflow-hidden self-center shrink-0 max-w-full my-auto"
        />
      </div>
      <div className="flex w-[342px] max-w-full flex-col items-stretch pr-4 mt-5 self-end max-md:mr-2.5 ml-auto">
        <div className="text-neutral-500 text-xs whitespace-nowrap">
          8/20/2020
        </div>
        <div className="items-stretch flex gap-0 mt-5 self-end justify-end">
          <div className="items-stretch bg-blue-600 flex w-full flex-col justify-center pl-2 py-1 rounded-md">
            <div className="items-stretch flex justify-between gap-2">
              <div className="items-stretch flex grow basis-[0%] flex-col">
                <div className="text-black text-sm leading-5 whitespace-nowrap">
                  Hi team 👋
                </div>
                <div className="bg-blue-600 flex shrink-0 h-px flex-col mt-2.5" />
              </div>
              <div className="justify-center items-stretch flex gap-1 mt-4 self-start">
                <div className="text-black text-xs grow whitespace-nowrap">
                  11:31 AM
                </div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/555b3a879f605d40c41019fb2cf0fba3e34804540c5e292383f8d523477f1a35?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                  className="aspect-[2] object-contain object-center w-4 overflow-hidden self-center shrink-0 max-w-full my-auto"
                />
              </div>
            </div>
          </div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/bd95d84b6a66a7f9ad2071492553ef7e8ce43485b925234b5e491f90665713a2?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
            className="aspect-[0.38] object-contain object-center w-[15px] justify-center items-start overflow-hidden shrink-0 max-w-full"
          />
        </div>
        <div className="items-stretch bg-blue-600 flex w-[264px] max-w-full flex-col justify-center mt-1.5 px-2 py-1 rounded-md self-end">
          <div className="items-stretch flex justify-between gap-2">
            <div className="items-stretch flex grow basis-[0%] flex-col">
              <div className="text-black text-sm leading-5 whitespace-nowrap">
                Anyone on for lunch today
              </div>
              <div className="bg-blue-600 flex shrink-0 h-px flex-col mt-2.5" />
            </div>
            <div className="justify-center items-stretch flex gap-1 mt-4 self-start">
              <div className="text-black text-xs grow whitespace-nowrap">
                11:31 AM
              </div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/555b3a879f605d40c41019fb2cf0fba3e34804540c5e292383f8d523477f1a35?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                className="aspect-[2] object-contain object-center w-4 overflow-hidden self-center shrink-0 max-w-full my-auto"
              />
            </div>
          </div>
        </div>
      </div>


      <div className="self-stretch mt-4 mx-4 max-md:max-w-full max-md:mr-2.5">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
          <div className="flex flex-col items-stretch w-[57%] max-md:w-full max-md:ml-0">
            <div className="flex grow flex-col items-stretch max-md:mt-7">
              <div className="flex justify-start gap-1 pr-20 items-start max-md:pr-5">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/b2c05a795cbdff5840f06567327f18e6e07523689e808525d3511128bb83b097?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/b2c05a795cbdff5840f06567327f18e6e07523689e808525d3511128bb83b097?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/b2c05a795cbdff5840f06567327f18e6e07523689e808525d3511128bb83b097?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/b2c05a795cbdff5840f06567327f18e6e07523689e808525d3511128bb83b097?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/b2c05a795cbdff5840f06567327f18e6e07523689e808525d3511128bb83b097?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/b2c05a795cbdff5840f06567327f18e6e07523689e808525d3511128bb83b097?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/b2c05a795cbdff5840f06567327f18e6e07523689e808525d3511128bb83b097?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/b2c05a795cbdff5840f06567327f18e6e07523689e808525d3511128bb83b097?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                  className="aspect-square object-contain object-center w-8 justify-center items-center overflow-hidden shrink-0 max-w-full"
                />
                <div className="items-stretch self-stretch flex justify-between gap-0">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/73fc80fe984f68dac32986f9ba5126d0a13c05717b1a93fa91930db0184d6926?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                    className="aspect-[0.25] object-contain object-center w-[15px] justify-center items-end overflow-hidden shrink-0 max-w-full"
                  />
                  <div className="items-stretch bg-gray-100 z-[1] flex w-full flex-col pr-3 py-1 rounded-none">
                    <div className="items-stretch flex justify-between gap-2.5 pr-20 max-md:pr-5">
                      <div className="text-zinc-800 text-sm font-semibold leading-5 whitespace-nowrap">
                        Jav
                      </div>
                      <div className="text-neutral-500 text-xs self-center whitespace-nowrap my-auto">
                        Engineering
                      </div>
                    </div>
                    <div className="items-stretch flex justify-between gap-2 mt-1">
                      <div className="flex grow basis-[0%] flex-col pr-20 items-start max-md:pr-5">
                        <div className="text-zinc-800 text-sm leading-5 whitespace-nowrap">
                          I’m down! Any ideas??
                        </div>
                        <div className="bg-gray-100 flex w-[148px] shrink-0 h-px flex-col mt-2.5" />
                      </div>
                      <div className="text-neutral-500 text-xs z-[1] grow whitespace-nowrap mt-4 self-end">
                        11:35 AM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-start gap-1 mt-16 items-start max-md:mt-10">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/beca3dbe76987950bd9326efc65f20182d72808192d4e3a511b121c12b51634d?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/beca3dbe76987950bd9326efc65f20182d72808192d4e3a511b121c12b51634d?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/beca3dbe76987950bd9326efc65f20182d72808192d4e3a511b121c12b51634d?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/beca3dbe76987950bd9326efc65f20182d72808192d4e3a511b121c12b51634d?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/beca3dbe76987950bd9326efc65f20182d72808192d4e3a511b121c12b51634d?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/beca3dbe76987950bd9326efc65f20182d72808192d4e3a511b121c12b51634d?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/beca3dbe76987950bd9326efc65f20182d72808192d4e3a511b121c12b51634d?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/beca3dbe76987950bd9326efc65f20182d72808192d4e3a511b121c12b51634d?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                  className="aspect-square object-contain object-center w-8 overflow-hidden shrink-0 max-w-full"
                />
                <div className="items-stretch self-stretch flex justify-between gap-0">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/73fc80fe984f68dac32986f9ba5126d0a13c05717b1a93fa91930db0184d6926?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                    className="aspect-[0.25] object-contain object-center w-[15px] justify-center items-end overflow-hidden shrink-0 max-w-full"
                  />
                  <div className="items-stretch bg-gray-100 flex w-full flex-col pr-2 py-1 rounded-none">
                    <div className="items-stretch flex justify-between gap-2.5 pr-20 max-md:pr-5">
                      <div className="text-zinc-800 text-sm font-semibold leading-5 whitespace-nowrap">
                        Aubrey
                      </div>
                      <div className="text-neutral-500 text-xs self-center whitespace-nowrap my-auto">
                        Product
                      </div>
                    </div>
                    <div className="items-stretch flex justify-between gap-2 mt-1">
                      <div className="items-stretch flex grow basis-[0%] flex-col">
                        <div className="text-zinc-800 text-sm leading-5 whitespace-nowrap">
                          I was thinking the cafe downtown
                        </div>
                        <div className="bg-gray-100 flex shrink-0 h-px flex-col mt-2.5" />
                      </div>
                      <div className="text-neutral-500 text-xs grow whitespace-nowrap mt-4 self-start">
                        11:45 AM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="self-stretch mt-3 mx-4 max-md:max-w-full max-md:mr-2.5">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
          <div className="flex flex-col items-stretch w-[72%] max-md:w-full max-md:ml-0">
            <div className="flex grow flex-col items-stretch max-md:mt-10">
              <div className="flex justify-start gap-1 pr-12 items-start max-md:pr-5">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/beca3dbe76987950bd9326efc65f20182d72808192d4e3a511b121c12b51634d?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/beca3dbe76987950bd9326efc65f20182d72808192d4e3a511b121c12b51634d?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/beca3dbe76987950bd9326efc65f20182d72808192d4e3a511b121c12b51634d?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/beca3dbe76987950bd9326efc65f20182d72808192d4e3a511b121c12b51634d?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/beca3dbe76987950bd9326efc65f20182d72808192d4e3a511b121c12b51634d?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/beca3dbe76987950bd9326efc65f20182d72808192d4e3a511b121c12b51634d?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/beca3dbe76987950bd9326efc65f20182d72808192d4e3a511b121c12b51634d?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/beca3dbe76987950bd9326efc65f20182d72808192d4e3a511b121c12b51634d?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                  className="aspect-square object-contain object-center w-8 overflow-hidden shrink-0 max-w-full"
                />
                <div className="items-stretch self-stretch flex justify-between gap-0">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/73fc80fe984f68dac32986f9ba5126d0a13c05717b1a93fa91930db0184d6926?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                    className="aspect-[0.25] object-contain object-center w-[15px] justify-center items-end overflow-hidden shrink-0 max-w-full"
                  />
                  <div className="items-stretch bg-gray-100 z-[1] flex w-full flex-col pr-2.5 py-1 rounded-none">
                    <div className="items-stretch flex justify-between gap-2.5 pr-20 max-md:pr-5">
                      <div className="text-zinc-800 text-sm font-semibold leading-5 whitespace-nowrap">
                        Aubrey
                      </div>
                      <div className="text-neutral-500 text-xs self-center whitespace-nowrap my-auto">
                        Product
                      </div>
                    </div>
                    <div className="items-stretch flex justify-between gap-2 mt-1">
                      <div className="items-stretch flex grow basis-[0%] flex-col pr-14 max-md:pr-5">
                        <div className="text-sky-600 text-sm leading-5 whitespace-nowrap">
                          <span className="text-zinc-800">
                            But limited vegan options{" "}
                          </span>
                          <span className="text-sky-600">@Janet</span>
                          <span className="text-zinc-800">!</span>
                        </div>
                        <div className="bg-gray-100 flex shrink-0 h-px flex-col mt-2.5" />
                      </div>
                      <div className="text-neutral-500 text-xs z-[1] grow whitespace-nowrap mt-4 self-end">
                        11:46 AM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-start gap-1 mt-20 items-start max-md:mt-10">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/fd40111ecb0810d11aac186178057e8f8208f486005ffbff27930fd7a1532cf5?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/fd40111ecb0810d11aac186178057e8f8208f486005ffbff27930fd7a1532cf5?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/fd40111ecb0810d11aac186178057e8f8208f486005ffbff27930fd7a1532cf5?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/fd40111ecb0810d11aac186178057e8f8208f486005ffbff27930fd7a1532cf5?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/fd40111ecb0810d11aac186178057e8f8208f486005ffbff27930fd7a1532cf5?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/fd40111ecb0810d11aac186178057e8f8208f486005ffbff27930fd7a1532cf5?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/fd40111ecb0810d11aac186178057e8f8208f486005ffbff27930fd7a1532cf5?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/fd40111ecb0810d11aac186178057e8f8208f486005ffbff27930fd7a1532cf5?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                  className="aspect-square object-contain object-center w-8 justify-center items-center overflow-hidden shrink-0 max-w-full"
                />
                <div className="items-stretch self-stretch flex justify-between gap-0">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/7aa69870a2ea4873f699fb0c5b904d9fc6a0c6670bad09cd380ad8c865bdc6f8?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                    className="aspect-[0.19] object-contain object-center w-[15px] justify-center items-end overflow-hidden shrink-0 max-w-full"
                  />
                  <div className="items-stretch bg-gray-100 flex w-full flex-col pr-2 py-1 rounded-none">
                    <div className="items-stretch flex justify-between gap-2.5 pr-20 max-md:pr-5">
                      <div className="text-zinc-800 text-sm font-semibold leading-5 whitespace-nowrap">
                        Janet
                      </div>
                      <div className="text-neutral-500 text-xs self-center whitespace-nowrap my-auto">
                        Engineering
                      </div>
                    </div>
                    <div className="items-stretch flex justify-between gap-2 mt-1">
                      <div className="items-stretch flex grow basis-[0%] flex-col">
                        <div className="text-zinc-800 text-sm leading-5">
                          That works- I was actually planning to
                          <br />
                          get a smoothie anyways 👍
                        </div>
                        <div className="bg-gray-100 flex shrink-0 h-px flex-col mt-2.5" />
                      </div>
                      <div className="text-neutral-500 text-xs grow whitespace-nowrap mt-9 self-end">
                        12:03 PM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-start gap-1 mt-4 pr-20 items-start max-md:pr-5">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/afb16b7d4d6a05b0370275a55e09d7bb41e02327af772151fc0fc71db328358a?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/afb16b7d4d6a05b0370275a55e09d7bb41e02327af772151fc0fc71db328358a?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/afb16b7d4d6a05b0370275a55e09d7bb41e02327af772151fc0fc71db328358a?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/afb16b7d4d6a05b0370275a55e09d7bb41e02327af772151fc0fc71db328358a?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/afb16b7d4d6a05b0370275a55e09d7bb41e02327af772151fc0fc71db328358a?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/afb16b7d4d6a05b0370275a55e09d7bb41e02327af772151fc0fc71db328358a?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/afb16b7d4d6a05b0370275a55e09d7bb41e02327af772151fc0fc71db328358a?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/afb16b7d4d6a05b0370275a55e09d7bb41e02327af772151fc0fc71db328358a?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                  className="aspect-square object-contain object-center w-8 overflow-hidden shrink-0 max-w-full"
                />
                <div className="items-stretch self-stretch flex justify-between gap-0">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/73fc80fe984f68dac32986f9ba5126d0a13c05717b1a93fa91930db0184d6926?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                    className="aspect-[0.25] object-contain object-center w-[15px] justify-center items-end overflow-hidden shrink-0 max-w-full"
                  />
                  <div className="items-stretch bg-gray-100 z-[1] flex w-full flex-col pr-3 py-1 rounded-none">
                    <div className="items-stretch flex justify-between gap-2.5 pr-20 max-md:pr-5">
                      <div className="text-zinc-800 text-sm font-semibold leading-5 whitespace-nowrap">
                        Janet
                      </div>
                      <div className="text-neutral-500 text-xs self-center whitespace-nowrap my-auto">
                        Product
                      </div>
                    </div>
                    <div className="items-stretch flex justify-between gap-2 mt-1">
                      <div className="flex grow basis-[0%] flex-col pr-20 items-start max-md:pr-5">
                        <div className="text-zinc-800 text-sm leading-5 whitespace-nowrap">
                          On for 12:30 PM then ?
                        </div>
                        <div className="bg-gray-100 flex w-[150px] shrink-0 h-px flex-col mt-2.5" />
                      </div>
                      <div className="text-neutral-500 text-xs z-[1] grow whitespace-nowrap mt-4 self-end">
                        12:04 PM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-stretch w-[28%] ml-5 max-md:w-full max-md:ml-0">
            <div className="items-stretch flex gap-0 my-auto max-md:mt-10">
              <div className="items-stretch bg-blue-600 flex w-full flex-col justify-center pl-2 py-1 rounded-md">
                <div className="items-stretch flex justify-between gap-2">
                  <div className="items-stretch flex grow basis-[0%] flex-col">
                    <div className="text-black text-sm leading-5 whitespace-nowrap">
                      Agreed
                    </div>
                    <div className="bg-blue-600 flex shrink-0 h-px flex-col mt-2.5" />
                  </div>
                  <div className="justify-center items-stretch flex gap-1 mt-4 self-start">
                    <div className="text-black text-xs grow whitespace-nowrap">
                      11:52 PM
                    </div>
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/555b3a879f605d40c41019fb2cf0fba3e34804540c5e292383f8d523477f1a35?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                      className="aspect-[2] object-contain object-center w-4 overflow-hidden self-center shrink-0 max-w-full my-auto"
                    />
                  </div>
                </div>
              </div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/bd95d84b6a66a7f9ad2071492553ef7e8ce43485b925234b5e491f90665713a2?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                className="aspect-[0.38] object-contain object-center w-[15px] justify-center items-start overflow-hidden shrink-0 max-w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="justify-center items-center w-full shadow-sm bg-white self-stretch flex gap-0 mt-48 px-3 max-md:max-w-full max-md:flex-wrap max-md:mt-10">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b5860a28721237936fb3c4d433f220eb87eb2ee53c4175d804f8f6198bb83beb?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
          className="aspect-[0.83] object-contain object-center w-10 justify-center items-center overflow-hidden self-stretch shrink-0 max-w-full"
        />
        <div className="text-neutral-500 text-sm leading-5 grow shrink basis-auto my-auto max-md:max-w-full">
          Start typing...
        </div>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/a915d1b00d455f6ab9900890a71924f1731278060d4e7dba5c737638121324b3?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
          className="aspect-[1.5] object-contain object-center w-[72px] justify-center items-start overflow-hidden self-stretch shrink-0 max-w-full"
        />
      </div>
    </div>
  );
}


